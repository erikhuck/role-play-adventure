from __future__ import annotations
import os
import pickle as pkl
import dataclasses as dclass
import enum
from lib.websocket import socketio


class Database:
    path = 'db.pkl'
    _loaded = False

    class Condition(enum.Enum):
        health = 'health'
        stamina = 'stamina'
        fatigue = 'fatigue'
        hunger = 'hunger'
        thirst = 'thirst'
        happiness = 'happiness'

    @dclass.dataclass
    class AbilityTemplate:
        name: str
        level: int
        effected_conditions: set[Database.Condition]
        condition_effect_size: int = 1

    @dclass.dataclass
    class Ability(AbilityTemplate):
        tmp_diff: int = 0

    @dclass.dataclass
    class PlayerAbility(Ability):
        xp: int = 0

    @dclass.dataclass
    class ItemTemplate:
        name: str
        weight: int
        effected_abilities: set[str]
        effected_conditions: set[Database.Condition]
        price: int
        ability_effect_size: int = 1
        condition_effect_size: int = 1
        max_charges: int = 5

    @dclass.dataclass
    class Item(ItemTemplate):
        charges: int = 5

    @dclass.dataclass
    class ContainerTemplate:
        name: str
        weight_capacity: int
        items: list[Database.ItemTemplate] = dclass.field(default_factory=list)
        coins: int = 0

    @dclass.dataclass
    class Container(ContainerTemplate):
        items: list[Database.Item]
        location: str = 'On person'

    @dclass.dataclass
    class CharacterTemplate:
        name: str
        abilities: dict[str, Database.AbilityTemplate]
        inventory: list[Database.ContainerTemplate]
        max_health: int = 100
        max_stamina: int = 100
        carrying_capacity: int = 100

    @dclass.dataclass
    class NPC(CharacterTemplate):
        abilities: dict[str, Database.Ability]
        inventory: list[Database.Container]
        health: int = 100
        stamina: int = 100

    @dclass.dataclass
    class Player(NPC):
        fatigue: int = 100
        hunger: int = 100
        thirst: int = 100
        happiness: int = 100
        max_fatigue: int = 100
        max_hunger: int = 100
        max_thirst: int = 100
        max_happiness: int = 100

    def __init__(self):
        if Database._loaded:
            raise RuntimeError('Database is already instantiated. There can only be one instance.')
        self._item_templates = dict[str, Database.ItemTemplate]()
        self._container_templates = {'satchel': Database.ContainerTemplate(name='satchel', weight_capacity=50)}
        self._ability_templates = dict[str, Database.AbilityTemplate]()
        self._npc_templates = dict[str, Database.CharacterTemplate]()
        self._npcs = list[Database.NPC]()
        self._players = dict[str, Database.Player]()
        self._save()

    @property
    def players(self) -> dict[str, Database.Player]:
        return self._players

    @property
    def npcs(self) -> list[Database.NPC]:
        return self._npcs

    @property
    def npc_templates(self) -> dict[str, Database.CharacterTemplate]:
        return self._npc_templates

    @property
    def ability_templates(self) -> dict[str, Database.AbilityTemplate]:
        return self._ability_templates

    @property
    def container_templates(self) -> dict[str, Database.ContainerTemplate]:
        return self._container_templates

    @property
    def item_templates(self) -> dict[str, Database.ItemTemplate]:
        return self._item_templates

    def add_player(self, name: str):
        abilities = {name: Database.PlayerAbility(**dclass.asdict(template)) for name, template in self._ability_templates.values()}
        inventory = [Database.Container(**dclass.asdict(self._container_templates['satchel']))]
        self._players[name] = Database.Player(name=name, abilities=abilities, inventory=inventory)
        self._save()

    def add_npc(self, name: str):
        template = self._npc_templates[name]
        kwargs = {
            **dclass.asdict(template),
            'abilities': {name: Database.Ability(
                **dclass.asdict(ability_template)) for name, ability_template in template.abilities.items()},
            'inventory': [Database.Container(
                **{**container_template, 'items': [Database.Item(**dclass.asdict(
                    item_template)) for item_template in container_template.items]}) for container_template in template.inventory]}
        self._npcs.append(Database.NPC(**kwargs))
        self._save()

    def add_npc_template(self, template: CharacterTemplate):
        self._npc_templates[template.name] = template
        self._save()

    def add_ability_template(self, template: Database.AbilityTemplate):
        self._ability_templates[template.name] = template
        for player in self._players.values():
            if template.name not in player.abilities:
                player.abilities[template.name] = Database.PlayerAbility(**dclass.asdict(template))
        self._save()

    def add_container_template(self, template: Database.ContainerTemplate):
        self._container_templates[template.name] = template
        self._save()

    def add_item_template(self, template: Database.ItemTemplate):
        self._item_templates[template.name] = template
        self._save()

    @staticmethod
    def _load() -> Database:
        if os.path.exists(Database.path):
            with open(Database.path, 'rb') as f:
                database = pkl.load(f)
        else:
            database = Database()
        Database._loaded = True
        return database

    def _save(self):
        with open(Database.path, 'wb') as f:
            pkl.dump(self, f)
        socketio.emit('reload')


# noinspection PyProtectedMember
db = Database._load()

# TODO add as GitHub issues
# Abilities
## Phase 1
* Abilities have a name (e.g. strength, willpower, persuasion, melee weapon, ranged weapon, dodge, etc.) and a level.
* Clicking an ability causes a random number to be generated between 1 and 20 inclusive.
* The ability level is added to the random number.
* Have a simple challenge rating for tasks i.e 5 is easy, 10 is moderate, 15 is hard, and 20 is very hard.
* Successfully using an ability results in an experience point tracked separately for that ability.
* Gaining 10 experience points results in an ability level increase.
* Skill levels all start out at 0 and have a max of 10.
* When a player needs to use an ability for the first time, they have the option to add the ability to their list of abilities.
* If the ability is not yet an option, the UI should be able to create a new ability and add it to the database.
## Phase 2
* Introduce NPCs with their own abilities and when an NPC is a target, the ability check result should go against that of the NPC.
* This is in addition to a simple challenge rating, not a replacement for it.
# Items
* Items should have the option to have an associated ability.
* This means that clicking an item runs an ability check.
* Passing the ability check means successful use of the item.
* Items should have effects e.g. decrease hit points,  when used.
* The effects can have targets e.g. a player or NPC.
* Items should have a number of charges
* e.g. if a sword is used, it takes damage and needs to be repaired.
* Successfully using an item should reduce its charge if it has one.
* Items should have a weight and there should be a limit on the amount of weight a character can carry.
* Players should have containers in their inventory e.g. backpack, satchel etc. They can have multiple containers.
* Players can also have mounts associated with them e.g. mule and mounts can have containers as well.
* Containers contain items. The total amount of weight in all the containers associated with a mount or player or NPC cannot exceed their total carrying capacity.
## Database changes
* A player should have a containers attribute, a many to many relationship with the container table
* The container should have an ID (primary key) and a name (not unique) and a many to many relationship with items
* Items should have an ID (primary key) and a name (not unique).
# Turns
* Should be able to add and remove NPCs from the turns as well.
* Ending a turn should decrease the hunger, thirst, and happiness levels (perhaps starts at 100) of that player.
* Players will need to eat, drink, and do something fun (e.g. eating a sweet treat, completing a quest, having sex, attending a festival, etc.) to restore those levels.
* Other things can decrease happiness like unfortunate events or doing something painful / uncomfortable.


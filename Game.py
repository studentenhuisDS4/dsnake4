import pygame as pygame
import random as r

from Map_Objects import *
from Snake import Snake
from Food import Food


class Game(object):
    starting_length = 0
    starting_position = []
    s = None
    current_floor = 0
    number_of_floors = 3

    main_obj_total = 0
    main_obj = []
    main_obj_collected = 0
    main_obj_locations = []

    krant_to_get = 0

    beer_to_get = 10
    beer_blocks_loss = 15

    weed_to_get = 10
    weed_time_effect = 105
    weed_counter = 0

    coffie_to_get = [10, 20, 30, 0]
    coffie_total_lives = 3
    coffie_lives_obtained = 0
    coffie_lives_used = 0

    def __init__(self, s_x, s_y):
        self.starting_length = 3
        for i in range(self.starting_length):
            self.starting_position.append((s_x + i, s_y, self.current_floor))

        self.width = 1050
        self.height = 600
        self.columns = 105
        self.rows = 60

        self.number_of_keys = 4
        self.keys_used = [0]*self.number_of_keys

        self.font = pygame.font.SysFont('Consolas', 20)
        self.food_types = {"coffie": 0, "beer": 0,
                           "weed": 0, "krant": 0, "main_obj": 0}
        self.food_colors = {"coffie": (154, 86, 27), "beer": (
            255, 255, 20), "weed": (70, 200, 0), "krant": (200, 200, 200), "main_obj": (255, 0, 0)}

        self.points = 0
        self.init_main_obj()
        self.s = Snake(self)
        self.map = Map(self)

    def init_main_obj(self):
        self.main_obj.append(Food("main_obj", (35, 38, 0), self))
        self.main_obj_locations.append("Andrea's Room")
        self.main_obj.append(Food("main_obj", (78, 40, 1), self))
        self.main_obj_locations.append("Janis' Room")
        self.main_obj.append(Food("main_obj", (50, 45, 0), self))
        self.main_obj_locations.append("The Kitchen")
        self.main_obj.append(Food("main_obj", (31, 40, 1), self))
        self.main_obj_locations.append("Margot's Room")
        self.main_obj.append(Food("main_obj", (95, 30, 2), self))
        self.main_obj_locations.append("Marcus' Room")
        self.main_obj.append(Food("main_obj", (8, 10, 1), self))
        self.main_obj_locations.append("Cork's Room")
        self.main_obj.append(Food("main_obj", (98, 35, 0), self))
        self.main_obj_locations.append("Daan's Room")
        self.main_obj.append(Food("main_obj", (12, 30, 2), self))
        self.main_obj_locations.append("Marloes' Room")
        self.main_obj.append(Food("main_obj", (53, 55, 1), self))
        self.main_obj_locations.append("The Front Yard")
        self.main_obj.append(Food("main_obj", (10, 52, 0), self))
        self.main_obj_locations.append("Sven's Room")
        self.main_obj.append(Food("main_obj", (40, 10, 2), self))
        self.main_obj_locations.append("Jerry's Room")
        self.main_obj.append(Food("main_obj", (98, 52, 0), self))
        self.main_obj_locations.append("Hannele's Room")
        self.main_obj.append(Food("main_obj", (88, 8, 1), self))
        self.main_obj_locations.append("Jeffrey's Room")

        merels_room = r.randint(1, 2)
        if merels_room == 1:
            self.main_obj.append(Food("main_obj", (21, 8, 1), self))
            self.main_obj_locations.append("Merel's Lower Room")
        else:
            self.main_obj.append(Food("main_obj", (44, 30, 2), self))
            self.main_obj_locations.append("Merel's Upper Room")

        self.main_obj.append(Food("main_obj", (70, 48, 2), self))
        self.main_obj_locations.append("Lotte's Room")
        self.main_obj.append(Food("main_obj", (55, 25, 1), self))
        self.main_obj_locations.append("The GR")
        self.main_obj.append(Food("main_obj", (13, 37, 0), self))
        self.main_obj_locations.append("Ben's Room")
        self.main_obj.append(Food("main_obj", (11, 40, 1), self))
        self.main_obj_locations.append("Miel's Room")
        self.main_obj.append(Food("main_obj", (97, 40, 1), self))
        self.main_obj_locations.append("Luuk's Room")
        self.main_obj.append(Food("main_obj", (14, 10, 2), self))
        self.main_obj_locations.append("Quentin's Room")
        self.main_obj.append(Food("main_obj", (52, 15, 0), self))
        self.main_obj_locations.append("The Binnenplaats")

        self.main_obj_total = len(self.main_obj)

    def eating_food(self, f):

        if not self.map.under_effect_of_weed or f.food_type != "weed":
            self.food_types[f.food_type] += 1
            self.points += f.points

        for i in range(min(f.block_parts, len(self.s.body))):
            self.s.undigested_food.append(self.s.body[i])

        if f.food_type == "main_obj":
            self.main_obj_collected += 1
            if self.main_obj_collected != self.main_obj_total:
                self.map.food.append(self.main_obj[self.main_obj_collected])
        else:
            self.map.add_random_food(self)

        if self.keys_used[0] == 0:
            if self.food_types["krant"] == self.krant_to_get and self.food_types["main_obj"] >= 1:
                self.food_types["krant"] = 0
                self.keys_used[0] = 1
                self.map.open_first_stair()
                self.map.add_random_food(self, "krant", 0)
                self.map.add_random_food(self, "krant", 0)
                self.map.add_random_food(self, "krant", 0)
                self.map.add_random_food(self, "krant", 1)
                self.map.add_random_food(self, "krant", 1)
                self.map.add_random_food(self, "krant", 1)
                self.krant_to_get = 6
        elif self.keys_used[1] == 0:
            if self.food_types["krant"] == self.krant_to_get and self.food_types["main_obj"] >= 4:
                self.food_types["krant"] = 0
                self.keys_used[1] = 1
                self.map.open_schuur_stair()
                self.map.add_random_food(self, "krant", 0)
                self.map.add_random_food(self, "krant", 0)
                self.map.add_random_food(self, "krant", 0)
                self.map.add_random_food(self, "krant", 1)
                self.map.add_random_food(self, "krant", 1)
                self.map.add_random_food(self, "krant", 1)
                self.map.add_random_food(self, "krant", 2, "r")
                self.map.add_random_food(self, "krant", 2, "r")
                self.krant_to_get = 8
        elif self.keys_used[2] == 0:
            if self.food_types["krant"] == self.krant_to_get and self.food_types["main_obj"] >= 7:
                self.food_types["krant"] = 0
                self.keys_used[2] = 1
                self.map.open_third_stair()
                self.map.add_random_food(self, "krant", 0)
                self.map.add_random_food(self, "krant", 0)
                self.map.add_random_food(self, "krant", 0)
                self.map.add_random_food(self, "krant", 0)
                self.map.add_random_food(self, "krant", 1)
                self.map.add_random_food(self, "krant", 1)
                self.map.add_random_food(self, "krant", 1)
                self.map.add_random_food(self, "krant", 1)
                self.map.add_random_food(self, "krant", 2, "l")
                self.map.add_random_food(self, "krant", 2, "l")
                self.map.add_random_food(self, "krant", 2, "r")
                self.map.add_random_food(self, "krant", 2, "r")
                self.krant_to_get = 12
        elif self.keys_used[3] == 0:
            if self.food_types["krant"] == self.krant_to_get and self.food_types["main_obj"] >= 10:
                self.food_types["krant"] = 0
                self.keys_used[3] = 1
                self.map.open_second_stair()

        if self.food_types["beer"] == self.beer_to_get:
            for i in range(self.beer_blocks_loss):
                if len(self.s.body) > 3:
                    self.s.body.pop()
            self.food_types["beer"] = 0
        if self.food_types["weed"] == self.weed_to_get and not self.map.under_effect_of_weed:
            self.weed_counter = self.weed_time_effect
            self.map.get_high()
        if self.food_types["coffie"] == self.coffie_to_get[self.coffie_lives_obtained] and self.coffie_lives_obtained < 3:
            self.food_types["coffie"] = 0
            self.coffie_lives_obtained += 1

        self.map.remove_food(self, f)

    def climbing_stairs(self, stair_identifier):
        stair_from = []
        stair_to = []
        next_floor = 0

        stair_length = 0

        for stair in self.map.get_stairs_at_floor(self.current_floor):
            if stair.identifier == stair_identifier:
                stair_from = stair
        if self.current_floor != 0:
            for stair in self.map.get_stairs_at_floor(self.current_floor - 1):
                if stair.identifier == stair_identifier:
                    stair_to = stair
                    next_floor = self.current_floor - 1
        if self.current_floor != self.number_of_floors - 1 and stair_to == []:
            for stair in self.map.get_stairs_at_floor(self.current_floor + 1):
                if stair.identifier == stair_identifier:
                    stair_to = stair
                    next_floor = self.current_floor + 1

        stair_length = stair_to.bottom_right[abs(
            stair_to.direction[1])] - stair_to.top_left[abs(stair_to.direction[1])]

        for i in range(stair_length):
            self.s.body.insert(0, (stair_to.climb_start[0] + i*stair_to.direction[0],
                                   stair_to.climb_start[1] + i*stair_to.direction[1], next_floor))
            if self.s.body[-1] in self.s.undigested_food:
                self.s.complete_digestion(self.s.body[-1])
                self.s.body[-1]
            else:
                self.s.body.pop()
            if len(list(dict.fromkeys(self.s.body))) != len(self.s.body):
                if self.use_life():
                    pygame.time.delay(500)
                    return False
                else:
                    pygame.time.delay(500)
                    return True
            self.s.food_eating(self)
        self.s.dirnx, self.s.dirny = (stair_to.direction)
        self.current_floor = next_floor

        return False

    def reduce_weed_counter(self):
        self.weed_counter -= 1
        if self.weed_counter == 0:
            self.map.get_sober()
            self.food_types["weed"] = 0

    def use_life(self):
        if self.coffie_lives_obtained - self.coffie_lives_used > 0:
            self.coffie_lives_used += 1
            self.points = max(self.points - self.coffie_lives_used * 300, 0) 
            
            snake_len = len(self.s.body)
            self.current_floor = 0
            self.s.reset(self)
            self.s.body = []
            for i in range(snake_len):
                self.s.body.append(
                    (self.starting_position[0][0] + i, self.starting_position[0][1], self.current_floor))
            return True
        else:
            return False

    def reset(self, s_x, s_y):
        self.current_floor = 0
        self.main_obj_collected = 0

        for i in list(self.food_types.keys()):
            self.food_types[i] = 0

        self.keys_used = [0]*len(self.keys_used)
        self.points = 0
        self.weed_counter = 0
        self.coffie_lives_obtained = 0
        self.coffie_lives_used = 0
        self.s.reset(self)
        self.map.reset(self)
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

    def __init__(self, s_x, s_y):
        self.starting_length = 3
        for i in range(self.starting_length):
            self.starting_position.append((s_x + i, s_y, self.current_floor))

        self.width = 1050
        self.height = 600
        self.columns = 105
        self.rows = 60

        self.keys_used = [0]

        self.font = pygame.font.SysFont('Consolas', 20)
        self.food_types = {"coffie": 0, "beer": 0, "weed": 0, "krant": 0, "main_obj": 0}
        self.food_colors = {"coffie": (154, 86, 27), "beer": (
            255, 255, 20), "weed": (70, 200, 0), "krant": (200, 200, 200), "main_obj": (255, 0, 0)}

        self.points = 0
        self.init_main_obj()
        self.s = Snake(self)
        self.map = Map(self)

    def init_main_obj(self):
        self.main_obj.append(Food("main_obj", (31,40,1), self))
        self.main_obj_locations.append("Margot's Room")
        self.main_obj.append(Food("main_obj", (35,38,0), self))
        self.main_obj_locations.append("Andrea's Room")
        self.main_obj.append(Food("main_obj", (95,30,2), self))
        self.main_obj_locations.append("Marcus' Room")
        self.main_obj.append(Food("main_obj", (98,35,0), self))
        self.main_obj_locations.append("Daan's Room")
        self.main_obj.append(Food("main_obj", (8,10,1), self))
        self.main_obj_locations.append("Cork's Room")
        self.main_obj.append(Food("main_obj", (12,30,2), self))
        self.main_obj_locations.append("Marloes' Room")
        self.main_obj.append(Food("main_obj", (78,40,1), self))
        self.main_obj_locations.append("Janis' Room")
        self.main_obj.append(Food("main_obj", (10,52,0), self))
        self.main_obj_locations.append("Sven's Room")
        self.main_obj.append(Food("main_obj", (40,10,2), self))
        self.main_obj_locations.append("Jerry's Room")
        self.main_obj.append(Food("main_obj", (98,52,0), self))
        self.main_obj_locations.append("Hannele's Room")
        self.main_obj.append(Food("main_obj", (88,8,1), self))
        self.main_obj_locations.append("Jeffrey's Room")

        merels_room = r.randint(1,2)
        if merels_room == 1:
            self.main_obj.append(Food("main_obj", (21,8,1), self))
            self.main_obj_locations.append("Merel's Lower Room")
        else:
            self.main_obj.append(Food("main_obj", (44,30,2), self))
            self.main_obj_locations.append("Merel's Upper Room")

        self.main_obj.append(Food("main_obj", (70,48,2), self))
        self.main_obj_locations.append("Lotte's Room")
        self.main_obj.append(Food("main_obj", (13,37,0), self))
        self.main_obj_locations.append("Ben's Room")
        self.main_obj.append(Food("main_obj", (11,40,1), self))
        self.main_obj_locations.append("Miel's Room")
        self.main_obj.append(Food("main_obj", (97,40,1), self))
        self.main_obj_locations.append("Luuk's Room")
        self.main_obj.append(Food("main_obj", (14,10,2), self))
        self.main_obj_locations.append("Quentin's Room")
        self.main_obj.append(Food("main_obj", (55,25,1), self))
        self.main_obj_locations.append("The GR")
        self.main_obj.append(Food("main_obj", (50,45,0), self))
        self.main_obj_locations.append("The Kitchen")
        self.main_obj.append(Food("main_obj", (53,55,1), self))
        self.main_obj_locations.append("The Front Yard")
        self.main_obj.append(Food("main_obj", (52,15,0), self))
        self.main_obj_locations.append("The Binnenplaats")


        self.main_obj_total = len(self.main_obj)

    def eating_food(self, f):
        self.food_types[f.food_type] += 1
        self.points += f.points
        

        for i in range(min(f.block_parts, len(self.s.body))):
        #for i in range(len(self.body)):
            self.s.undigested_food.append(self.s.body[i])

        if f.food_type == "main_obj":
            self.main_obj_collected += 1
            if self.main_obj_collected != self.main_obj_total:
                self.map.food.append(self.main_obj[self.main_obj_collected])

        if self.food_types["krant"] == 5 and self.keys_used[0] == 0:
            self.keys_used[0] = 1
            self.map.delete_tropen_wall()

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

        stair_length = stair_to.bottom_right[abs(stair_to.direction[1])] - stair_to.top_left[abs(stair_to.direction[1])]

        for i in range(stair_length):
            self.s.body.insert(0, (stair_to.climb_start[0] + i*stair_to.direction[0], stair_to.climb_start[1] + i*stair_to.direction[1], next_floor))
            if self.s.body[-1] in self.s.undigested_food:
                self.s.complete_digestion(self.s.body[-1])
                last_pos = self.s.body[-1]
            else:
                last_pos = self.s.body.pop()
            if last_pos in self.s.turns:
                self.s.turns.pop(last_pos)
            if len(list(dict.fromkeys(self.s.body))) != len(self.s.body):
                pygame.time.delay(500)
                self.reset(50, 20)
                return
            self.s.food_eating(self)
        self.s.dirnx, self.s.dirny = (stair_to.direction)
        self.current_floor = next_floor

        return

    def reset(self, s_x, s_y):
        self.current_floor = 0
        self.starting_length = 3
        self.starting_position = []
        self.main_obj_collected = 0

        for i in range(self.starting_length):
            self.starting_position.append((s_x + i, s_y, self.current_floor))

        for i in list(self.food_types.keys()):
            self.food_types[i] = 0

        self.keys_used = [0]*len(self.keys_used)
        self.points = 0
        self.s.reset(self)
        self.map.reset(self)
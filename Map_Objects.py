import pygame as pygame
import random as r

from Food import Food

class Wall(object):
    floor = 0
    start = (0,0)
    finish = (0,0)
    direction = 0

    def __init__(self, floor, start, finish, direction):
        self.floor = floor
        self.start = start
        self.finish = finish
        self.direction = direction
class Stair(object):
    floor = 0
    top_left = (0,0)
    bottom_right = (0,0)
    identifier = 0
    direction = (0,0)
    climb_start = (0,0)

    def __init__(self, floor, top_left, bottom_right, identifier, direction, climb_start):
        self.floor = floor
        self.top_left = top_left
        self.bottom_right = bottom_right
        self.identifier = identifier
        self.direction = direction
        self.climb_start = climb_start

class Map(object):
    walls = []
    stairs = []
    food = []

    tropen_wall = 0

    def __init__(self, g):
        self.init_first_floor()
        self.init_second_floor()
        self.init_third_floor()
        self.init_stairs()
        self.init_food(g)

    def init_first_floor(self):
        # contour walls
        self.walls.append(Wall(0, (0, 0), (104, 0), 0))
        self.walls.append(Wall(0, (104, 0), (104, 60), 1))
        self.walls.append(Wall(0, (0, 59), (104, 59), 0))
        self.walls.append(Wall(0, (0, 0), (0, 59), 1))

        self.walls.append(Wall(0, (0, 10), (12, 10), 0))
        self.walls.append(Wall(0, (19, 10), (30, 10), 0))
        self.walls.append(Wall(0, (30, 0), (30, 6), 1))
        self.walls.append(Wall(0, (30, 7), (30, 11), 1))
        self.walls.append(Wall(0, (0, 30), (30, 30), 0))
        self.walls.append(Wall(0, (33, 30), (48, 30), 0))
        self.walls.append(Wall(0, (52, 30), (64, 30), 0))
        self.walls.append(Wall(0, (68, 30), (80, 30), 0))
        self.walls.append(Wall(0, (85, 30), (90, 30), 0))
        self.walls.append(Wall(0, (90, 25), (90, 40), 1))
        self.walls.append(Wall(0, (90, 45), (90, 60), 1))
        self.walls.append(Wall(0, (93, 42), (104, 42), 0))
        self.walls.append(Wall(0, (75, 30), (75, 56), 1))
        self.walls.append(Wall(0, (75, 57), (75, 60), 1))
        self.walls.append(Wall(0, (90, 25), (95, 25), 0))
        self.walls.append(Wall(0, (98, 25), (104, 25), 0))
        self.walls.append(Wall(0, (45, 30), (45, 37), 1))
        self.walls.append(Wall(0, (45, 41), (45, 50), 1))
        self.walls.append(Wall(0, (45, 54), (45, 60), 1))
        self.walls.append(Wall(0, (0, 45), (21, 45), 0))
        self.walls.append(Wall(0, (25, 45), (45, 45), 0))
        self.walls.append(Wall(0, (20, 45), (20, 50), 1))
        self.walls.append(Wall(0, (20, 54), (20, 60), 1))
        self.walls.append(Wall(0, (25, 30), (25, 45), 1))

        #protecting stairs
        self.walls.append(Wall(0, (56, 27), (59, 27), 0))
        self.walls.append(Wall(0, (59, 27), (59, 30), 1))
        
        self.walls.append(Wall(0, (42, 49), (45, 49), 0))

        #Tropen wall
        self.walls.append(Wall(0, (12, 10), (19, 10), 0))
        self.tropen_wall = len(self.walls) - 1
    def init_second_floor(self):
        # contour walls
        self.walls.append(Wall(1, (0, 0), (104, 0), 0))
        self.walls.append(Wall(1, (104, 0), (104, 60), 1))
        self.walls.append(Wall(1, (0, 59), (104, 59), 0))
        self.walls.append(Wall(1, (0, 0), (0, 59), 1))

        self.walls.append(Wall(1, (0, 50), (4, 50), 0))
        self.walls.append(Wall(1, (7, 50), (35, 50), 0))
        self.walls.append(Wall(1, (39, 50), (57, 50), 0))
        self.walls.append(Wall(1, (64, 50), (78, 50), 0))
        self.walls.append(Wall(1, (80, 50), (95, 50), 0))
        self.walls.append(Wall(1, (98, 50), (104, 50), 0))

        self.walls.append(Wall(1, (0, 30), (7, 30), 0))
        self.walls.append(Wall(1, (11, 30), (33, 30), 0))
        self.walls.append(Wall(1, (37, 30), (40, 30), 0))
        self.walls.append(Wall(1, (19, 30), (19, 50), 1))

        self.walls.append(Wall(1, (0, 20), (7, 20), 0))
        self.walls.append(Wall(1, (11, 20), (15, 20), 0))
        self.walls.append(Wall(1, (15, 16), (30, 16), 0))
        self.walls.append(Wall(1, (15, 2), (15, 21), 1))
        self.walls.append(Wall(1, (30, 0), (30, 9), 1))
        self.walls.append(Wall(1, (30, 13), (30, 17), 1))
        self.walls.append(Wall(1, (40, 0), (40, 5), 1))
        self.walls.append(Wall(1, (40, 9), (40, 19), 1))
        self.walls.append(Wall(1, (40, 25), (40, 50), 1))
        self.walls.append(Wall(1, (70, 0), (70, 18), 1))

        self.walls.append(Wall(1, (70, 15), (74, 15), 0))
        self.walls.append(Wall(1, (79, 15), (104, 15), 0))
        self.walls.append(Wall(1, (70, 23), (70, 50), 1))

        self.walls.append(Wall(1, (70, 30), (74, 30), 0))
        self.walls.append(Wall(1, (78, 30), (95, 30), 0))
        self.walls.append(Wall(1, (99, 30), (104, 30), 0))
        self.walls.append(Wall(1, (88, 30), (88, 50), 1))

        #protecting stairs
        self.walls.append(Wall(1, (54, 1), (54, 3), 1))
        self.walls.append(Wall(1, (58, 1), (58, 3), 1))
        
        self.walls.append(Wall(1, (36, 9), (40, 9), 0))
        self.walls.append(Wall(1, (36, 9), (36, 13), 1))
        
        self.walls.append(Wall(1, (1, 23), (4, 23), 0))
        self.walls.append(Wall(1, (1, 27), (4, 27), 0))
        
        self.walls.append(Wall(1, (101, 20), (104, 20), 0))
        self.walls.append(Wall(1, (101, 24), (104, 24), 0))
    def init_third_floor(self):
        # contour walls
        self.walls.append(Wall(2, (0, 0), (104, 0), 0))
        self.walls.append(Wall(2, (104, 0), (104, 60), 1))
        self.walls.append(Wall(2, (0, 59), (104, 59), 0))
        self.walls.append(Wall(2, (0, 0), (0, 59), 1))

        #dividing walls
        self.walls.append(Wall(2, (55, 0), (55, 59), 1))
        self.walls.append(Wall(2, (56, 0), (56, 59), 1))

        #left part
        self.walls.append(Wall(2, (28, 3), (28, 20), 1))
        self.walls.append(Wall(2, (0, 20), (24, 20), 0))
        self.walls.append(Wall(2, (33, 20), (55, 20), 0))

        self.walls.append(Wall(2, (3, 40), (23, 40), 0))
        self.walls.append(Wall(2, (23, 50), (29, 50), 0))
        self.walls.append(Wall(2, (35, 50), (55, 50), 0))
        self.walls.append(Wall(2, (23, 20), (23, 28), 1))
        self.walls.append(Wall(2, (23, 33), (23, 50), 1))
        
        
        self.walls.append(Wall(2, (36, 20), (36, 25), 1))
        self.walls.append(Wall(2, (36, 29), (36, 38), 1))
        self.walls.append(Wall(2, (36, 38), (55, 38), 0))

        #right part
        self.walls.append(Wall(2, (70, 25), (70, 28), 1))
        self.walls.append(Wall(2, (70, 31), (70, 40), 1))
        self.walls.append(Wall(2, (56, 25), (70, 25), 0))
        self.walls.append(Wall(2, (70, 40), (80, 40), 0))

        self.walls.append(Wall(2, (85, 0), (85, 5), 1))
        self.walls.append(Wall(2, (85, 11), (85, 59), 1))

        #protecting stairs
        self.walls.append(Wall(2, (52, 42), (55, 42), 0))
        self.walls.append(Wall(2, (52, 46), (55, 46), 0))

        self.walls.append(Wall(2, (57, 10), (60, 10), 0))
        self.walls.append(Wall(2, (57, 14), (60, 14), 0))

    def init_stairs(self):
        self.stairs = []

        self.stairs.append(Stair(0, (56, 28), (59, 30), 0, (-1, 0), (58,28)))
        self.stairs.append(Stair(1, (55, 1), (58, 3), 0, (0, 1), (56,1)))

        self.stairs.append(Stair(0, (42, 46), (45, 49), 1, (-1, 0), (44, 47)))
        self.stairs.append(Stair(1, (37, 10), (40, 13), 1, (0, 1), (38,10)))

        self.stairs.append(Stair(1, (1, 24), (4, 27), 2, (1, 0), (1, 25)))
        self.stairs.append(Stair(2, (52, 43), (55, 46), 2, (-1, 0), (54, 44)))

        self.stairs.append(Stair(1, (101, 21), (104, 24), 3, (-1, 0), (103, 22)))
        self.stairs.append(Stair(2, (57, 11), (60, 14), 3, (1, 0), (57, 12)))
    def init_food(self, g):
        self.food = []
        self.add_random_food(g, "coffie", 0)
        self.add_random_food(g, "beer", 0)
        self.add_random_food(g, "weed", 0)
        self.add_random_food(g, "krant", 0)
        
        self.add_random_food(g, "coffie", 1)
        self.add_random_food(g, "beer", 1)
        self.add_random_food(g, "weed", 1)
        self.add_random_food(g, "krant", 1)
        
        self.add_random_food(g, "coffie", 2)
        self.add_random_food(g, "beer", 2)
        self.add_random_food(g, "weed", 2)
        self.add_random_food(g, "krant", 2)

        self.add_food(g.main_obj[0])

    def add_random_food(self, g, *argv):
        not_legal = True
        if len(argv) == 0:
            f_type = list(g.food_types.keys())[r.randint(0, 3)]               
            floor = r.randint(0, g.number_of_floors-1)
        elif len(argv) == 1 and type(argv) == type(""):
            f_type = argv
        elif len(argv) == 1 and type(argv) == type(1):
            floor = argv
        else:
            f_type = argv[0]
            floor = argv[1]

        while not_legal:
            row = r.randint(0, g.rows-1)
            col = r.randint(0, g.columns-1)
            not_legal = self.is_food_not_legal(g, (col, row, floor))
        self.add_food(Food(f_type, (col, row, floor), g))

    def is_food_not_legal(self, g, pos):
        for wall in self.get_walls_at_floor(pos[2]):
            direction = wall.direction
            for block in range(wall.finish[direction] - wall.start[direction]):
                i = wall.start[0] + (1 - direction)*block
                j = wall.start[1] + direction*block
                if (i, j) == (pos[0], pos[1]):
                    return True
        for stair in self.get_stairs_at_floor(pos[2]):
            for i in range(stair.bottom_right[0] - stair.top_left[0]):
                for j in range(stair.bottom_right[1] - stair.top_left[1]):
                    if (stair.top_left[0] + i, stair.top_left[1] + j) == (pos[0], pos[1]):
                        return True

        for f in self.food:
            if f.position == pos:
                return True
        for snake_block in g.s.body:
            if snake_block == pos:
                return True
        return False

    def add_food(self, f):
        self.food.append(f)

    def remove_food(self, g, f):
        if f.food_type != "main_obj":
            self.add_random_food(g)
        for i in range(len(self.food)):
            if f.position == self.food[i].position:
                self.food.pop(i)
                return

    def get_stairs_at_floor(self, floor):
        stairs = []

        for s in self.stairs:
            if s.floor == floor:
                stairs.append(s)

        return stairs

    def get_walls_at_floor(self, floor):
        walls = []

        for w in self.walls:
            if w.floor == floor:
                walls.append(w)

        return walls

    def delete_tropen_wall(self):
        self.walls.pop(self.tropen_wall)
        self.tropen_wall = 0
        print("Tropen Door OPENED!")

    def reset(self, g):
        self.walls = []
        self.init_first_floor()
        self.init_second_floor()
        self.init_third_floor()
        self.init_stairs()
        self.init_food(g)

    def draw(self, surface, g):
        dis = g.width/g.columns

        for wall in self.get_walls_at_floor(g.current_floor):
            direction = wall.direction
            for block in range(wall.finish[direction] - wall.start[direction]):
                i = wall.start[0] + (1 - direction)*block
                j = wall.start[1] + direction*block
                pygame.draw.rect(surface, (255, 255, 255),
                                 (i*dis+1, j*dis+1, dis-1, dis-1))

        for stair in self.get_stairs_at_floor(g.current_floor):
            for i in range(stair.bottom_right[0] - stair.top_left[0]):
                for j in range(stair.bottom_right[1] - stair.top_left[1]):
                    pygame.draw.rect(surface, (14, 37, 255), ((i+stair.top_left[0])*dis+1, (j+stair.top_left[1])*dis+1, dis-1, dis-1))

        for f in self.food:
            i = f.position[0]
            j = f.position[1]
            if f.position[2] == g.current_floor:
                pygame.draw.rect(surface, f.color,
                                 (i*dis+1, j*dis+1, dis-1, dis-1))

        g.s.draw(surface, g)
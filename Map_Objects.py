import pygame as pygame
import random as r

from Food import Food
from Shop import *


class Wall(object):
    floor = 0
    start = (0, 0)
    length = 0
    direction = 0
    status = "visible"  # visible/invisible/see_through
    breakable = True

    def __init__(self, floor, start, length, direction, status="visible", breakable=True):
        self.floor = floor
        self.start = start
        self.length = length
        self.direction = direction
        self.status = status
        self.breakable = breakable


class Block(object):
    floor = 0
    top_left = (0, 0)
    bottom_right = (0, 0)

    def __init__(self, floor, top_left, bottom_right):
        self.floor = floor
        self.top_left = top_left
        self.bottom_right = bottom_right


class Stair(Block):
    identifier = 0
    direction = (0, 0)
    climb_start = (0, 0)

    def __init__(self, floor, top_left, bottom_right, identifier, direction, climb_start):
        super().__init__(floor, top_left, bottom_right)
        self.identifier = identifier
        self.direction = direction
        self.climb_start = climb_start


class ShopElement(Block):
    color = (0, 0, 0)
    text_color = (0, 0, 0)
    item = None

    def __init__(self, floor, top_left, bottom_right):
        super().__init__(floor, top_left, bottom_right)


class Furniture(Block):
    image_index = 0
    active = False
    counter = 0

    def __init__(self, floor, top_left, bottom_right, image_index):
        super().__init__(floor, top_left, bottom_right)
        self.image_index = image_index

    def activate(self):
        self.active = True


class Map(object):
    walls = []
    stairs = []
    shop_elements = []
    food = []
    furniture = []

    bin_stair_wall = 0
    gr_stair_wall = 0
    front_yard_wall = 0
    grot1_stair_wall = 0
    grot2_stair_wall = 0
    schuur1_stair_wall = 0
    schuur2_stair_wall = 0
    floor1_stair_wall = 0
    floor2_stair_wall = 0
    tropen_wall = 0

    GREEN = pygame.Color('green1')
    RED = pygame.Color('tomato')
    BLACK = pygame.Color('black')

    under_effect_of_weed = False

    def __init__(self, g):
        self.init_first_floor()
        self.init_second_floor()
        self.init_third_floor()
        self.init_tropen()
        self.init_shop()
        self.init_stairs()
        self.init_furniture()
        self.init_food(g)

    def init_first_floor(self):
        # contour walls
        self.walls.append(Wall(0, (0, 0), 13, 0, breakable=False))
        self.walls.append(Wall(0, (18, 0), 86, 0, breakable=False))
        self.walls.append(Wall(0, (104, 0), 60, 1, breakable=False))
        self.walls.append(Wall(0, (0, 59), 104, 0, breakable=False))
        self.walls.append(Wall(0, (0, 0), 59, 1, breakable=False))

        self.walls.append(Wall(0, (0, 10), 12, 0))
        self.walls.append(Wall(0, (19, 10), 12, 0))
        self.walls.append(Wall(0, (30, 0), 6, 1))
        self.walls.append(Wall(0, (30, 7), 4, 1))
        self.walls.append(Wall(0, (0, 30), 10, 0))
        self.walls.append(Wall(0, (11, 30), 19, 0))
        self.walls.append(Wall(0, (33, 30), 15, 0))
        self.walls.append(Wall(0, (52, 30), 12, 0))
        self.walls.append(Wall(0, (68, 30), 12, 0))
        self.walls.append(Wall(0, (85, 30), 5, 0))
        self.walls.append(Wall(0, (90, 25), 15, 1))
        self.walls.append(Wall(0, (90, 45), 15, 1))
        self.walls.append(Wall(0, (93, 42), 11, 0))
        self.walls.append(Wall(0, (75, 30), 26, 1))
        self.walls.append(Wall(0, (75, 57), 3, 1))
        self.walls.append(Wall(0, (90, 25), 5, 0))
        self.walls.append(Wall(0, (98, 25), 6, 0))
        self.walls.append(Wall(0, (45, 30), 7, 1))
        self.walls.append(Wall(0, (45, 41), 9, 1))
        self.walls.append(Wall(0, (45, 54), 6, 1))
        self.walls.append(Wall(0, (0, 45), 21, 0))
        self.walls.append(Wall(0, (25, 45), 20, 0))
        self.walls.append(Wall(0, (20, 45), 5, 1))
        self.walls.append(Wall(0, (20, 54), 6, 1))
        self.walls.append(Wall(0, (25, 30), 15, 1))

        # protecting stairs
        self.walls.append(Wall(0, (56, 27), 3, 0, breakable=False))
        self.walls.append(Wall(0, (59, 27), 3, 1, breakable=False))
        self.walls.append(Wall(0, (56, 30), 4, 0, breakable=False))
        # Binnenplaats stair wall
        self.walls.append(Wall(0, (55, 27), 3, 1, breakable=False))
        self.bin_stair_wall = len(self.walls) - 1

        self.walls.append(Wall(0, (42, 49), 3, 0, breakable=False))
        self.walls.append(Wall(0, (41, 45), 5, 0, breakable=False))
        self.walls.append(Wall(0, (45, 46), 4, 1, breakable=False))
        # Grot stair wall
        self.walls.append(Wall(0, (41, 46), 4, 1, breakable=False))
        self.grot1_stair_wall = len(self.walls) - 1

        # Front yard corridor
        self.walls.append(Wall(0, (1, 24), 2, 0))

        # Tropen wall
        self.walls.append(Wall(0, (12, 1), 7, 0, breakable=False))
        self.tropen_wall = len(self.walls) - 1

    def init_second_floor(self):
        # contour walls
        self.walls.append(Wall(1, (0, 0), 104, 0, breakable=False))
        self.walls.append(Wall(1, (104, 0), 60, 1, breakable=False))
        self.walls.append(Wall(1, (0, 59), 104, 0, breakable=False))
        self.walls.append(Wall(1, (0, 0), 59, 1, breakable=False))

        self.walls.append(Wall(1, (0, 50), 6, 0))
        self.walls.append(Wall(1, (9, 50), 26, 0))
        self.walls.append(Wall(1, (39, 50), 18, 0))
        self.walls.append(Wall(1, (64, 50), 14, 0))
        self.walls.append(Wall(1, (80, 50), 15, 0))
        self.walls.append(Wall(1, (98, 50), 6, 0))

        self.walls.append(Wall(1, (0, 30), 7, 0))
        self.walls.append(Wall(1, (11, 30), 22, 0))
        self.walls.append(Wall(1, (37, 30), 3, 0))
        self.walls.append(Wall(1, (19, 30), 20, 1))

        self.walls.append(Wall(1, (0, 20), 7, 0))
        self.walls.append(Wall(1, (11, 20), 4, 0))
        self.walls.append(Wall(1, (15, 16), 15, 0))
        self.walls.append(Wall(1, (15, 2), 19, 1))
        self.walls.append(Wall(1, (30, 0), 9, 1))
        self.walls.append(Wall(1, (30, 13), 4, 1))
        self.walls.append(Wall(1, (40, 0), 5, 1))
        self.walls.append(Wall(1, (40, 9), 10, 1))
        self.walls.append(Wall(1, (40, 25), 25, 1))
        self.walls.append(Wall(1, (70, 0), 18, 1))

        self.walls.append(Wall(1, (70, 15), 4, 0))
        self.walls.append(Wall(1, (79, 15), 25, 0))
        self.walls.append(Wall(1, (70, 23), 27, 1))

        self.walls.append(Wall(1, (70, 30), 4, 0))
        self.walls.append(Wall(1, (78, 30), 17, 0))
        self.walls.append(Wall(1, (99, 30), 5, 0))
        self.walls.append(Wall(1, (88, 30), 20, 1))

        # protecting stairs
        self.walls.append(Wall(1, (54, 1), 2, 1, breakable=False))
        self.walls.append(Wall(1, (58, 1), 2, 1, breakable=False))
        # GR stair wall
        self.walls.append(Wall(1, (54, 3), 5, 0, breakable=False))
        self.gr_stair_wall = len(self.walls) - 1

        self.walls.append(Wall(1, (36, 9), 4, 0, breakable=False))
        self.walls.append(Wall(1, (36, 9), 4, 1, breakable=False))
        self.walls.append(Wall(1, (40, 9), 5, 1, breakable=False))
        # Grot stair wall
        self.walls.append(Wall(1, (36, 13), 4, 0, breakable=False))
        self.grot2_stair_wall = len(self.walls) - 1

        self.walls.append(Wall(1, (1, 23), 3, 0, breakable=False))
        self.walls.append(Wall(1, (1, 27), 3, 0, breakable=False))
        # Floor1 stair wall
        self.walls.append(Wall(1, (4, 23), 5, 1, breakable=False))
        self.floor1_stair_wall = len(self.walls) - 1

        self.walls.append(Wall(1, (101, 20), 3, 0, breakable=False))
        self.walls.append(Wall(1, (101, 24), 3, 0, breakable=False))
        # Schuur stair wall
        self.walls.append(Wall(1, (100, 20), 5, 1, breakable=False))
        self.schuur1_stair_wall = len(self.walls) - 1

        # Front yard wall
        self.walls.append(Wall(1, (0, 50), 104, 0, breakable=False))
        self.front_yard_wall = len(self.walls) - 1

    def init_third_floor(self):
        # contour walls
        self.walls.append(Wall(2, (0, 0), 104, 0, breakable=False))
        self.walls.append(Wall(2, (104, 0), 60, 1, breakable=False))
        self.walls.append(Wall(2, (0, 59), 104, 0, breakable=False))
        self.walls.append(Wall(2, (0, 0), 59, 1, breakable=False))

        # dividing walls
        self.walls.append(Wall(2, (55, 0), 59, 1, breakable=False))
        self.walls.append(Wall(2, (56, 0), 59, 1, breakable=False))

        # left part
        self.walls.append(Wall(2, (28, 3), 17, 1))
        self.walls.append(Wall(2, (0, 20), 24, 0))
        self.walls.append(Wall(2, (33, 20), 22, 0))

        self.walls.append(Wall(2, (3, 40), 20, 0))
        self.walls.append(Wall(2, (23, 50), 6, 0))
        self.walls.append(Wall(2, (35, 50), 20, 0))
        self.walls.append(Wall(2, (23, 20), 8, 1))
        self.walls.append(Wall(2, (23, 33), 17, 1))

        self.walls.append(Wall(2, (36, 20), 5, 1))
        self.walls.append(Wall(2, (36, 29), 9, 1))
        self.walls.append(Wall(2, (36, 38), 19, 0))

        # right part
        self.walls.append(Wall(2, (70, 25), 3, 1))
        self.walls.append(Wall(2, (70, 31), 9, 1))
        self.walls.append(Wall(2, (56, 25), 14, 0))
        self.walls.append(Wall(2, (70, 40), 10, 0))

        self.walls.append(Wall(2, (85, 0), 5, 1))
        self.walls.append(Wall(2, (85, 11), 48, 1))

        # protecting stairs
        self.walls.append(Wall(2, (52, 42), 3, 0, breakable=False))
        self.walls.append(Wall(2, (52, 46), 3, 0, breakable=False))
        # Floor2 stair wall
        self.walls.append(Wall(2, (51, 42), 5, 1, breakable=False))
        self.floor2_stair_wall = len(self.walls) - 1

        self.walls.append(Wall(2, (57, 10), 3, 0, breakable=False))
        self.walls.append(Wall(2, (57, 14), 3, 0, breakable=False))
        # Schuur stair wall
        self.walls.append(Wall(2, (60, 10), 5, 1, breakable=False))
        self.schuur2_stair_wall = len(self.walls) - 1

    def init_tropen(self):
        # contour walls
        self.walls.append(Wall(3, (0, 0), 104, 0, breakable=False))
        self.walls.append(Wall(3, (104, 0), 104, 1, breakable=False))
        self.walls.append(Wall(3, (0, 59), 104, 0, breakable=False))
        self.walls.append(Wall(3, (0, 0), 59, 1, breakable=False))

        # dividing walls
        self.walls.append(Wall(3, (15, 0), 59, 1, breakable=False))
        self.walls.append(Wall(3, (90, 0), 59, 1, breakable=False))

        self.walls.append(Wall(3, (15, 15), 25, 0))
        self.walls.append(Wall(3, (45, 15), 25, 0))
        self.walls.append(Wall(3, (75, 15), 15, 0))
        self.walls.append(Wall(3, (40, 15), 5, 1))
        self.walls.append(Wall(3, (40, 24), 18, 1))
        self.walls.append(Wall(3, (40, 46), 13, 1))
        self.walls.append(Wall(3, (17, 37), 23, 0))
        self.walls.append(Wall(3, (53, 3), 12, 1))
        self.walls.append(Wall(3, (65, 35), 24, 0))
        self.walls.append(Wall(3, (65, 35), 9, 1))
        self.walls.append(Wall(3, (65, 48), 11, 1))

    def init_shop(self):
        # contour walls
        self.walls.append(Wall(4, (0, 0), 104, 0, breakable=False))
        self.walls.append(Wall(4, (104, 0), 20, 1, breakable=False))
        self.walls.append(Wall(4, (0, 0), 20, 1, breakable=False))
        self.walls.append(Wall(4, (35, 0), 20, 1, breakable=False))
        self.walls.append(Wall(4, (69, 0), 20, 1, breakable=False))

        self.shop_elements = []

        self.shop_elements.append(ShopElement(4, (1, 1), (35, 20)))
        self.shop_elements.append(ShopElement(4, (36, 1), (69, 20)))
        self.shop_elements.append(ShopElement(4, (70, 1), (104, 20)))

    def init_stairs(self):
        self.stairs = []

        self.stairs.append(Stair(0, (56, 28), (59, 30), 0, (-1, 0), (58, 28)))
        self.stairs.append(Stair(1, (55, 1), (58, 3), 0, (0, 1), (56, 1)))

        self.stairs.append(Stair(0, (42, 46), (45, 49), 1, (-1, 0), (44, 47)))
        self.stairs.append(Stair(1, (37, 10), (40, 13), 1, (0, 1), (38, 10)))

        self.stairs.append(Stair(1, (1, 24), (4, 27), 2, (1, 0), (1, 25)))
        self.stairs.append(Stair(2, (52, 43), (55, 46), 2, (-1, 0), (54, 44)))

        self.stairs.append(
            Stair(1, (101, 21), (104, 24), 3, (-1, 0), (103, 22)))
        self.stairs.append(Stair(2, (57, 11), (60, 14), 3, (1, 0), (57, 12)))

        self.stairs.append(Stair(0, (1, 25), (3, 30), 4, (1, 0), (1, 27)))
        self.stairs.append(Stair(1, (1, 51), (3, 59), 4, (1, 0), (1, 55)))

        self.stairs.append(Stair(0, (13, 0), (18, 1), 5, (0, 1), (15, 1)))
        self.stairs.append(Stair(3, (41, 58), (65, 59), 5, (0, -1), (53, 58)))

        self.stairs.append(Stair(0, (75, 1), (104, 5), 6, (0, 1), (90, 1)))
        self.stairs.append(Stair(4, (0, 59), (105, 60), 6, (0, -1), (53, 58)))
        self.stairs.append(Stair(4, (0, 20), (1, 59), 6, (0, -1), (53, 97)))
        self.stairs.append(
            Stair(4, (104, 20), (105, 59), 6, (0, -1), (53, 97)))

    def init_furniture(self):
        self.furniture = []

        self.furniture.append(Furniture(1, (45, 56), (48, 59), 0))
        self.furniture.append(Furniture(1, (61, 1), (64, 5), 1))


    def init_food(self, g):
        self.food = []

        self.add_random_food(g, "coffie", 0)
        self.add_random_food(g, "beer", 0)
        self.add_random_food(g, "weed", 0)
        self.add_random_food(g, "krant", 0)
        self.add_random_food(g, "coffie", 0)
        self.add_random_food(g, "beer", 0)
        self.add_random_food(g, "weed", 0)
        self.add_random_food(g, "krant", 0)
        self.add_random_food(g, "coffie", 1)
        self.add_random_food(g, "beer", 1)
        self.add_random_food(g, "weed", 1)
        self.add_random_food(g, "krant", 1)
        self.add_random_food(g, "coffie", 1)
        self.add_random_food(g, "beer", 1)
        self.add_random_food(g, "weed", 1)
        self.add_random_food(g, "krant", 1)
        self.add_random_food(g, "coffie", 2)
        self.add_random_food(g, "beer", 2)
        self.add_random_food(g, "weed", 2)
        self.add_random_food(g, "krant", 2)
        self.add_random_food(g, "coffie", 2)
        self.add_random_food(g, "beer", 2)
        self.add_random_food(g, "weed", 2)
        self.add_random_food(g, "krant", 2)
        self.add_random_food(g, "coffie", 3)
        self.add_random_food(g, "beer", 3)
        self.add_random_food(g, "weed", 3)
        self.add_random_food(g, "krant", 3)
        self.add_random_food(g, "coffie", 3)
        self.add_random_food(g, "beer", 3)
        self.add_random_food(g, "weed", 3)
        self.add_random_food(g, "krant", 3)

        self.add_food(g.main_obj[0])

    def add_random_food(self, g, *argv):
        not_legal = True
        third_floor = ""
        if len(argv) == 0:
            f_type = list(g.food_colors.keys())[r.randint(0, 3)]
            floor = r.randint(0, g.number_of_floors-1)
        elif len(argv) == 1 and type(argv) == type(""):
            f_type = argv
        elif len(argv) == 1 and type(argv) == type(1):
            floor = argv
        elif len(argv) == 2:
            f_type = argv[0]
            floor = argv[1]
        else:
            f_type = argv[0]
            floor = argv[1]
            third_floor = argv[2]

        while not_legal:
            col = r.randint(0, g.columns-1)
            row = r.randint(0, g.rows-1)
            not_legal = self.is_food_not_legal(g, (col, row, floor))

        self.add_food(Food(f_type, (col, row, floor), g))

    def is_food_not_legal(self, g, pos):
        for wall in self.get_walls_at_floor(pos[2], draw=True):
            direction = wall.direction
            for block in range(wall.length):
                i = wall.start[0] + (1 - direction)*block
                j = wall.start[1] + direction*block
                if (i, j) == (pos[0], pos[1]):
                    return True

        for stair in self.get_stairs_at_floor(pos[2]):
            for i in range(stair.bottom_right[0] - stair.top_left[0]):
                for j in range(stair.bottom_right[1] - stair.top_left[1]):
                    if (stair.top_left[0] + i, stair.top_left[1] + j) == (pos[0], pos[1]):
                        return True

        for f in g.main_obj:
            if f.position == pos:
                return True
        for f in self.food:
            if f.position == pos:
                return True

        if pos[2] == 3 and (pos[0] > 90 or pos[0] < 15):
            return True

        if pos in g.s.body:
            return True
        return False

    def add_food(self, f):
        self.food.append(f)

    def remove_food(self, g, f):
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

    def get_walls_at_floor(self, floor, draw=False):
        walls = []
        status_to_return = ["visible"]
        if draw:
            status_to_return.append("see_through")
        for w in self.walls:
            if w.floor == floor and w.status in status_to_return:
                walls.append(w)

        return walls

    def get_high(self):
        self.under_effect_of_weed = True
        for w in self.walls:
            if w.breakable and w.status == "visible":
                w.status = "see_through"

    def get_sober(self):
        self.under_effect_of_weed = False
        for w in self.walls:
            if w.status == "see_through":
                w.status = "visible"

    def update_shop(self, g=None):
        for i in range(len(self.shop_elements)):
            self.shop_elements[i].item = g.current_shop_items[i]
        self.update_shop_color(g)

    def update_shop_color(self, g=None):
        for i in range(len(self.shop_elements)):
            if g.points >= self.shop_elements[i].item.cost and self.shop_elements[i].item.weight > 0 and self.shop_elements[i].item.key != '404':
                self.shop_elements[i].color = self.GREEN
            else:
                self.shop_elements[i].color = self.RED
            self.shop_elements[i].text_color = self.BLACK

    def open_first_stair(self):
        self.walls[self.bin_stair_wall].status = "invisible"
        self.walls[self.gr_stair_wall].status = "invisible"
        print("Outside Stair OPENED!")

    def open_front_yard(self):
        self.walls[self.front_yard_wall].status = "invisible"
        print("Front Yard OPENED!")

    def open_second_stair(self):
        self.walls[self.grot1_stair_wall].status = "invisible"
        self.walls[self.grot2_stair_wall].status = "invisible"
        print("Inside Stair OPENED!")

    def open_third_stair(self):
        self.walls[self.floor1_stair_wall].status = "invisible"
        self.walls[self.floor2_stair_wall].status = "invisible"
        print("Upstairs OPENED!")

    def open_schuur_stair(self):
        self.walls[self.schuur1_stair_wall].status = "invisible"
        self.walls[self.schuur2_stair_wall].status = "invisible"
        print("Schuur Stair OPENED!")

    def open_tropen(self):
        self.walls[self.tropen_wall].status = "invisible"
        print("Tropen OPENED!")

    def reset(self, g):
        self.walls = []
        self.init_first_floor()
        self.init_second_floor()
        self.init_third_floor()
        self.init_tropen()
        self.init_shop()
        self.init_stairs()
        self.init_food(g)
        self.init_furniture()
        self.open_tropen()
        self.open_first_stair()
        self.open_schuur_stair()
        self.open_third_stair()

        self.get_sober()
        self.under_effect_of_weed = False

    def draw(self, surface, g, fu_images=[]):
        dis = g.width/g.columns

        for wall in self.get_walls_at_floor(g.current_floor, draw=True):
            if wall.status != "invisible":
                direction = wall.direction
                for block in range(wall.length):
                    i = wall.start[0] + (1 - direction)*block
                    j = wall.start[1] + direction*block
                    if wall.status == "visible":
                        pygame.draw.rect(surface, (255, 255, 255),
                                         (i*dis+1, j*dis+1, dis-1, dis-1))
                    else:
                        pygame.draw.rect(surface, (255, 255, 255),
                                         (i*dis+1, j*dis+1, dis-1, dis-1), int(dis/6))

        for stair in self.get_stairs_at_floor(g.current_floor):
            for i in range(stair.bottom_right[0] - stair.top_left[0]):
                for j in range(stair.bottom_right[1] - stair.top_left[1]):
                    pygame.draw.rect(surface, (14, 37, 255), ((
                        i+stair.top_left[0])*dis+1, (j+stair.top_left[1])*dis+1, dis-1, dis-1))

        for fur in self.furniture:
            if fur.active and fur.floor == g.current_floor:
                surface.blit(fu_images[fur.image_index], (fur.top_left[0]*dis + 1, fur.top_left[1]*dis + 1))


        for f in self.food:
            i = f.position[0]
            j = f.position[1]
            if f.position[2] == g.current_floor:
                pygame.draw.rect(surface, f.color,
                                 (i*dis+1, j*dis+1, dis-1, dis-1))

        if g.current_floor == 4:
            self.draw_shop(surface=surface, g=g)

        g.s.draw(surface, g)

    def draw_shop(self, surface=None, g=None):
        dis = g.width/g.columns

        for s in self.shop_elements:
            for i in range(s.bottom_right[0] - s.top_left[0]):
                for j in range(s.bottom_right[1] - s.top_left[1]):
                    pygame.draw.rect(surface, s.color, ((
                        i+s.top_left[0])*dis+1, (j+s.top_left[1])*dis+1, dis, dis))
            name = g.font.render(s.item.name, False, s.text_color)
            surface.blit(name, (s.top_left[0]*dis + 30, 40))
            description = g.font.render(
                s.item.description, False, s.text_color)
            surface.blit(description, (s.top_left[0]*dis + 30, 70))
            cost = g.font.render(str(s.item.cost), False, s.text_color)
            surface.blit(cost, (s.top_left[0]*dis + 30, 100))

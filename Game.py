import pygame as pygame
import random as r

from Map_Objects import *
from Snake import Snake
from Food import Food


class Game(object):
    starting_length = 3
    starting_floor = 0
    starting_position = []
    s = None
    current_floor = 0
    number_of_floors = 4

    main_obj_total = 0
    main_obj = []
    main_obj_collected = 0
    main_obj_locations = []

    max_lives = 3
    lives_obtained = 0
    lives_used = 0

    def __init__(self, s_x, s_y):
        self.current_floor = self.starting_floor
        for i in range(self.starting_length):
            self.starting_position.append((s_x + i, s_y, self.current_floor))

        self.width = 1050
        self.height = 600
        self.columns = 105
        self.rows = 60

        self.font = pygame.font.SysFont('Consolas', 20)
        self.food_colors = {"coffie": (154, 86, 27), "beer": (
            255, 255, 20), "weed": (70, 200, 0), "krant": (200, 200, 200), "main_obj": (255, 0, 0)}

        self.points = 0
        self.init_main_obj()
        self.s = Snake(self)
        self.map = Map(self)
        self.map.open_tropen()
        self.map.open_first_stair()
        self.map.open_schuur_stair()
        self.map.open_second_stair()
        self.map.open_third_stair()

    def move_snake(self):
        climbed = False

        for event in pygame.event.get():
            if event.type == pygame.QUIT:
                # TODO catch exeption if game already quit
                pygame.quit()
                exit()

            keys = pygame.key.get_pressed()

            if keys[pygame.K_LEFT] or keys[pygame.K_a]:
                self.s.turn('LEFT')
            elif (keys[pygame.K_RIGHT] or keys[pygame.K_d]):
                self.s.turn('RIGHT')
            elif (keys[pygame.K_UP] or keys[pygame.K_w]):
                self.s.turn('UP')
            elif (keys[pygame.K_DOWN] or keys[pygame.K_s]):
                self.s.turn('DOWN')
            elif keys[pygame.K_SPACE]:
                return climbed, self.points, False, True
            break

        # check for stairs
        climbed, game_ended = self.stair_climbing()

        self.s.move()

        if game_ended:
            return climbed, self.points, True, False

        # check for self-collisions
        if self.s.self_collision():
            return climbed, self.points, self.fatal_collision(), False

        # check for collisions with walls
        if self.collision_with_walls():
            return climbed, self.points, self.fatal_collision(), False

        # check if the snake ate food
        self.food_eating()

        return climbed, self.points, False, False

    def init_main_obj(self):
        self.main_obj = []
        self.main_obj_locations = []
        self.main_obj.append(Food("main_obj", (35, 38, 0), self))
        self.main_obj_locations.append("Andrea's Room")
        self.main_obj.append(Food("main_obj", (78, 40, 1), self))
        self.main_obj_locations.append("Janis' Room")
        self.main_obj.append(Food("main_obj", (50, 45, 0), self))
        self.main_obj_locations.append("The Kitchen")
        self.main_obj.append(Food("main_obj", (31, 40, 1), self))
        self.main_obj_locations.append("Margot's Room")
        self.main_obj.append(Food("main_obj", (95, 20, 2), self))
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
        self.main_obj.append(Food("main_obj", (53, 15, 0), self))
        self.main_obj_locations.append("The Binnenplaats")
        self.main_obj.append(Food("main_obj", (71, 8, 3), self))
        self.main_obj_locations.append("Ilse's Room")
        self.main_obj.append(Food("main_obj", (28, 48, 3), self))
        self.main_obj_locations.append("Charlie's Room")
        self.main_obj.append(Food("main_obj", (34, 8, 3), self))
        self.main_obj_locations.append("Jarno's Room")
        self.main_obj.append(Food("main_obj", (78, 46, 3), self))
        self.main_obj_locations.append("Fenna's Room")
        self.main_obj.append(Food("main_obj", (28, 26, 3), self))
        self.main_obj_locations.append("David's Room")

        c = list(zip(self.main_obj, self.main_obj_locations))
        r.shuffle(c)
        self.main_obj, self.main_obj_locations = zip(*c)

        self.main_obj_total = len(self.main_obj)

    def collision_with_walls(self):
        for wall in self.map.get_walls_at_floor(self.current_floor):
            direction = wall.direction
            for block in range(wall.finish[direction] - wall.start[direction]):
                i = wall.start[0] + (1 - direction)*block
                j = wall.start[1] + direction*block
                if self.s.body[0] == (i, j, self.current_floor):
                    return True
        return False

    def food_eating(self):
        for f in self.map.food:
            if f.position == self.s.body[0]:
                self.points += f.points
                self.s.add_undigested_food(
                    min(f.block_parts, len(self.s.body)))

                if f.food_type == "main_obj":
                    self.main_obj_collected += 1
                    if self.main_obj_collected != self.main_obj_total:
                        # Add Restarting
                        self.map.food.append(
                            self.main_obj[self.main_obj_collected])
                else:
                    self.map.add_random_food(self)

                self.map.remove_food(self, f)

    def stair_climbing(self):
        for stair in self.map.get_stairs_at_floor(self.s.body[0][2]):
            for i in range(stair.bottom_right[0] - stair.top_left[0]):
                for j in range(stair.bottom_right[1] - stair.top_left[1]):
                    if (stair.top_left[0] + i, stair.top_left[1] + j, self.current_floor) == self.s.body[0]:
                        stair_identifier = stair.identifier
                        stair_to = None
                        next_floor = 0

                        stair_length = 0

                        for i in range(self.number_of_floors):
                            if i != stair.floor:
                                for st in self.map.get_stairs_at_floor(i):
                                    if st.identifier == stair_identifier:
                                        stair_to = st
                                        next_floor = i

                        stair_length = stair_to.bottom_right[abs(
                            stair_to.direction[1])] - stair_to.top_left[abs(stair_to.direction[1])]

                        self.s.body.insert(0, (stair_to.climb_start[0], stair_to.climb_start[1], stair_to.floor))
                        (self.s.dirnx, self.s.dirny) = stair_to.direction
                        
                        for i in range(stair_length):
                            self.s.move()

                            # check for self-collisions
                            if self.s.self_collision():
                                return True, self.fatal_collision()

                            # check for collisions with walls
                            if self.collision_with_walls():
                                return True, self.fatal_collision()

                            # check if the snake ate food
                            self.food_eating()

                        self.s.dirnx, self.s.dirny = (stair_to.direction)
                        self.current_floor = next_floor

                        return True, False

        return False, False

    def use_life(self):
        if self.lives_obtained - self.lives_used > 0:
            self.lives_used += 1
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

    def fatal_collision(self):
        pygame.time.delay(500)
        return not self.use_life()

    def reset(self, s_x, s_y):
        self.current_floor = self.starting_floor
        self.main_obj_collected = 0
        self.init_main_obj()
        
        self.points = 0
        self.lives_obtained = 0
        self.lives_used = 0
        self.s.reset(self)
        self.map.reset(self)


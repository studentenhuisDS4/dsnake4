import pygame as pygame
import random as r

from Map_Objects import *
from Snake import Snake
from Food import Food
from Shop import *


class Game(object):
    starting_length = 3
    starting_floor = 0
    starting_position = []
    s = None
    current_floor = 0
    number_of_floors = 5

    main_obj_total = 0
    main_obj = []
    main_obj_collected = 0
    main_obj_locations = []

    max_lives = 3
    lives_obtained = 0
    lives_used = 0

    weed_counter = 0
    weed = False
    weed_effect_length = 105

    speed = 15
    double_speed = False
    half_speed = False

    boost_counter = 0
    boost_max = 100

    shop = None
    current_shop_items = []

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
        self.init_main_obj()

        self.points = 0

        self.s = Snake(self)

        self.map = Map(g=self)
        self.map.open_tropen()
        self.map.open_first_stair()
        self.map.open_schuur_stair()
        self.map.open_third_stair()

        self.init_shop()

    def move_snake(self):
        climbed = False
        moved = False

        for event in pygame.event.get():
            if event.type == pygame.QUIT:
                # TODO catch exeption if game already quit
                pygame.quit()
                exit()
            elif event.type == pygame.KEYUP:
                if event.key == pygame.K_SPACE:
                    self.double_speed = False
                elif event.key == pygame.K_v:
                    self.half_speed = False
            elif event.type == pygame.KEYDOWN:
                if event.key == pygame.K_SPACE:
                    self.double_speed = True
                elif event.key == pygame.K_v:
                    self.half_speed = True
                elif event.key == pygame.K_h and self.weed:
                    self.map.get_high()
                    self.weed_counter = self.weed_effect_length
                    self.weed = False
                elif event.key == pygame.K_p:
                    self.half_speed = False
                    self.double_speed = False
                    return climbed, self.points, False, True
                elif not moved:
                    if event.key == pygame.K_LEFT or event.key == pygame.K_a:
                        self.s.turn('LEFT')
                        moved = True
                    elif event.key == pygame.K_RIGHT or event.key == pygame.K_d:
                        self.s.turn('RIGHT')
                        moved = True
                    elif event.key == pygame.K_UP or event.key == pygame.K_w:
                        self.s.turn('UP')
                        moved = True
                    elif event.key == pygame.K_DOWN or event.key == pygame.K_s:
                        self.s.turn('DOWN')
                        moved = True

        
        self.speed = 15
        if self.double_speed and self.boost_counter > 0:
            self.speed = 30
        elif self.half_speed and self.boost_counter > 0:
            self.speed = 10

        if self.speed != 15:
            self.boost_counter -= 1

        self.s.move()

        if self.current_floor == 4:
            self.shop_buying()

        # check for stairs
        climbed, game_ended = self.stair_climbing()

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

        self.reduce_weed_counter()
        
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

    def init_shop(self):
        items = []

        items.append(ShopItem(cost=100, name='Open Front Yard',
                              description='', key='ofy', section=0, weight=1))
        items.append(ShopItem(cost=100, name='Open Inside Stair',
                              description='', key='ois', section=0, weight=1))
        items.append(ShopItem(cost=200, name='Coffie Machine', description='Koffie',
                              key='cm1', section=1, weight=1))
        items.append(ShopItem(cost=200, name='Coffie Machine', description='Koffie',
                              key='cm2', section=1, weight=1))
        items.append(ShopItem(cost=200, name='Mail Box', description='New puzzles',
                              key='0mb', section=1, weight=1))
        items.append(ShopItem(cost=1000, name='Cassette Player', description='New Music Friday',
                              key='0cp', section=1, weight=0.5))
        items.append(ShopItem(cost=150, name='Reduce by 20', description='Shortening potion',
                              key='r20', section=2, weight=1))
        items.append(ShopItem(cost=100, name='Weed', description='Go through walls',
                              key='wee', section=2, weight=1))
        items.append(ShopItem(cost=200, name='1 UP', description='Get an extra life (max 3)',
                              key='li1', section=2, weight=1))

        self.shop = Shop(all_items=items, n_sections=3)
        self.current_shop_items = [None]*3
        self.refresh_shop()

    def collision_with_walls(self):
        for wall in self.map.get_walls_at_floor(self.current_floor):
            direction = wall.direction
            for block in range(wall.length):
                i = wall.start[0] + (1 - direction)*block
                j = wall.start[1] + direction*block
                if self.s.body[0] == (i, j, self.current_floor):
                    print('Collided with a wall')
                    return True

        for fur in self.map.furniture:
            for i in range(fur.bottom_right[0] - fur.top_left[0]):
                for j in range(fur.bottom_right[1] - fur.top_left[1]):
                    if (fur.top_left[0] + i, fur.top_left[1] + j, self.current_floor) == self.s.body[0] and fur.active:
                        print('Collided with furniture')
                        return True
        return False

    def food_eating(self):
        for f in self.map.food:
            if f.position == self.s.body[0]:
                self.points += f.points
                self.s.add_undigested_food(
                    min(f.block_parts, len(self.s.body)))

                if f.food_type == "main_obj":
                    self.refresh_shop()
                    self.main_obj_collected += 1
                    if self.main_obj_collected != self.main_obj_total:
                        # Add Restarting
                        self.map.food.append(
                            self.main_obj[self.main_obj_collected])
                else:
                    self.map.add_random_food(self)
                    self.boost_counter = min(
                        self.boost_max, self.boost_counter + f.boost)

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

                        self.s.move(
                            move_to=(stair_to.climb_start[0], stair_to.climb_start[1], stair_to.floor))
                        self.s.turn(stair_to.direction)

                        for i in range(stair_length):
                            self.s.move()

                        # check for self-collisions
                        if self.s.self_collision():
                            return True, self.fatal_collision()

                        # check if the snake ate food
                        self.food_eating()

                        if stair_to.floor == 4:
                            self.map.update_shop_color(self)

                        self.s.dirnx, self.s.dirny = (stair_to.direction)
                        self.current_floor = next_floor

                        return True, False

        return False, False

    def shop_buying(self):
        for se in self.map.shop_elements:
            for i in range(se.bottom_right[0] - se.top_left[0]):
                for j in range(se.bottom_right[1] - se.top_left[1]):
                    if se.item.key != '404' and (se.top_left[0] + i, se.top_left[1] + j, self.current_floor) == self.s.body[0] and self.points >= se.item.cost and se.item.weight > 0:
                        self.points -= se.item.cost

                        key = se.item.key

                        self.shop.buy_object(key)
                        self.shop.delete_item(key)

                        if key == 'ofy':
                            self.map.open_front_yard()
                        elif key == 'ois':
                            self.map.open_second_stair()
                        elif key == 'li1':
                            self.lives_obtained += 1
                            self.shop.add_item(ShopItem(cost=400, name='1 UP', description='Get an extra life (max 3)',
                                                        key='li2', section=2, weight=1))
                        elif key == 'li2':
                            self.lives_obtained += 1
                            self.shop.add_item(ShopItem(cost=800, name='1 UP', description='Get an extra life (max 3)',
                                                        key='li3', section=2, weight=1))
                        elif key == 'li3':
                            self.lives_obtained += 1
                        elif key == 'r20':
                            self.s.reduce(20)
                            self.shop.add_item(ShopItem(
                                cost=150, name='Reduce by 20', description='Shortening potion', key='r20', section=2, weight=1))
                        elif key == 'wee':
                            self.weed = True
                            self.shop.add_item(ShopItem(
                                cost=100, name='Weed', description='Go through walls', key='wee', section=2, weight=1))
                        elif key == '0mb':
                            self.map.furniture[0].activate()
                        elif key == '0cp':
                            self.map.furniture[1].activate()

                        self.map.update_shop_color(g=self)

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

    def refresh_shop(self):
        for s in range(self.shop.n_sections):
            self.current_shop_items[s] = self.shop.select_random_item(
                section=s)

        self.map.update_shop(self)

    def reduce_weed_counter(self):
        if self.weed_counter == 0:
            return
        elif self.weed_counter == 1:
            self.weed_counter = 0
            self.map.get_sober()
            self.shop.add_item(ShopItem(cost=100, name='Weed', description='Go through walls',
                                        key='wee', section=2, weight=1))

        else:
            self.weed_counter -= 1

    def fatal_collision(self):
        pygame.time.delay(500)
        return not self.use_life()

    def reset(self, s_x, s_y):
        self.current_floor = self.starting_floor
        self.main_obj_collected = 0
        self.double_speed = False
        self.half_speed = False
        self.speed = 15
        self.boost_counter = 0
        self.init_main_obj()

        self.points = 0
        self.lives_obtained = 0
        self.lives_used = 0
        self.s.reset(self)
        self.map.reset(self)

        self.init_shop()
        self.refresh_shop()

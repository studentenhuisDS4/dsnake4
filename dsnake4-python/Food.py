import pygame as pygame
import random as r


class Food(object):
    food_type = ""
    points = 0
    block_parts = 0
    boost = 0
    position = (0, 0, 0)

    def __init__(self, food_type, pos, g):
        self.food_type = food_type
        self.position = pos
        self.color = g.food_colors[food_type]

        if food_type == "coffie":
            self.points = 5
            self.block_parts = 1
            self.boost = 20
        elif food_type == "beer":
            self.points = 15
            self.boost = 5
            self.block_parts = 1
        elif food_type == "weed":
            self.points = 20
            self.boost = 0
            self.block_parts = 1
        elif food_type == "krant":
            self.points = 10
            self.boost = 10
            self.block_parts = 1
        elif food_type == "main_obj":
            self.points = 100
            self.block_parts = 5

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
    height = 0
    width = 0

    def __init__(self, floor, top_left, height, width):
        self.floor = floor
        self.top_left = top_left
        self.height = height
        self.width = width


class Stair(Block):
    identifier = 0
    direction = (0, 0)

    def __init__(self, floor, top_left, height, width, identifier, direction):
        super().__init__(floor, top_left, height, width)
        self.identifier = identifier
        self.direction = direction


class ShopElement(Block):
    color = (0, 0, 0)
    text_color = (0, 0, 0)
    item = None

    def __init__(self, floor, top_left, height, width):
        super().__init__(floor, top_left, height, width)


class Furniture(Block):
    image_index = 0
    active = False
    counter = 0

    def __init__(self, floor, top_left, height, width, image_index):
        super().__init__(floor, top_left, height, width)
        self.image_index = image_index

    def activate(self):
        self.active = True



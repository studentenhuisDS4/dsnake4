import pygame


class Spritesheet(object):
    def __init__(self, filename="", total_objects=None, objects_in_line=None, object_size=None):
        if total_objects != None:
            self.total_objects = total_objects
        if objects_in_line != None:
            self.objects_in_line = objects_in_line
        if object_size != None:
            self.object_size = object_size
        self.sheet = pygame.image.load(filename).convert()
    # Load a specific image from a specific rectangle

    def image_at(self, rectangle, colorkey=None):
        rect = pygame.Rect(rectangle)
        image = pygame.Surface(rect.size).convert()
        image.blit(self.sheet, (0, 0), rect)
        if colorkey is not None:
            if colorkey is -1:
                colorkey = image.get_at((0, 0))
            image.set_colorkey(colorkey, pygame.RLEACCEL)
        return image
    # Load a whole bunch of images and return them as a list

    def images_at(self, rects, colorkey=None):
        return [self.image_at(rect, colorkey) for rect in rects]

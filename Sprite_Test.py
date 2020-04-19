import pygame


class Spritesheet(object):
    def __init__(self, filename):
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


pygame.init()
pygame.font.init()
black = (0,0,0)
white = (255,255,255)
window = pygame.display.set_mode((250, 250))
window.fill(white)

s_sheet = Spritesheet("images/sprite_objects.png")

sprite_rectancles = {"colored_beer": (0, 0, 11, 45),
                    "gray_beer": (18, 0, 11, 45),
                    "coffie_cup": (39, 9, 23, 28),
                    "colored_krant": (71, 6, 22, 13),
                    "gray_krant": (71, 27, 22, 13)}

window.blit(s_sheet.image_at(sprite_rectancles["gray_krant"]), (15, 15))
pygame.display.update()
pygame.time.delay(1000)

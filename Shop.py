from copy import deepcopy
import random as random


class ShopItem(object):
    cost = 0
    name = ''
    description = ''
    key = ''
    section = 0
    repeatable = False
    weight = 1

    def __init__(self, cost=0, name='', description='', key='000', section=0, repeatable=False, weight=1):
        self.cost = cost
        self.name = name
        self.description = description
        self.key = key
        self.section = section
        self.repeatable = repeatable
        self.weight = weight


class Shop(object):
    items = []
    bought_items = {}
    n_sections = 0

    def __init__(self, all_items=[], n_sections=1):
        self.items = deepcopy(all_items)
        for i in self.items:
            self.bought_items[i.key] = 0
        self.n_sections = n_sections
        self.check_empty_section()

    def get_items_at_section(self, section=0):
        it = []
        for i in self.items:
            if i.section == section:
                it.append(i)

        return it

    def select_random_item(self, section=0):
        it = self.get_items_at_section(section)
        weigths = []

        for i in it:
            weigths.append(i.weight)

        return it[self.weighted_choice(weights=weigths)]

    def check_empty_section(self):
        for s in range(self.n_sections):
            w = []
            for it in self.get_items_at_section(s):
                w.append(it.weight)
            if sum(w) == 0:
                empty_item = ShopItem(0, name='Empty', description='You boght all the items in this section',
                                      key='404', section=s, repeatable=True, weight=1)
                self.items.append(empty_item)


    def buy_object(self, key=''):
        for i in self.items:
            if i.key == key:
                self.bought_items[key] += 1
                if not i.repeatable:
                    i.weight = 0
                self.check_empty_section()
    
    def weighted_choice(self, weights=[]):
        total = sum(w for w in weights)
        r = random.uniform(0, total)
        upto = 0
        for i in range(len(weights)):
            if upto + weights[i] >= r:
                return i
            upto += weights[i]


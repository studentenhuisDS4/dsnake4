from copy import deepcopy
import random as random


class ShopItem(object):
    cost = 0
    name = ''
    description = ''
    key = ''
    section = 0
    weight = 1

    def __init__(self, cost=0, name='', description='', key='000', section=0, weight=1):
        self.cost = cost
        self.name = name
        self.description = description
        self.key = key
        self.section = section
        self.weight = weight


class Shop(object):
    items = []
    n_sections = 0

    def __init__(self, all_items=[], n_sections=1):
        self.items = deepcopy(all_items)
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
                empty_item = ShopItem(0, name='Empty', description='All items bought',
                                      key='404', section=s, weight=1)
                self.items.append(empty_item)


    def buy_object(self, key=''):
        for i in self.items:
            if i.key == key:
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
    
    def delete_item(self, key='000'):
        for i in range(len(self.items)):
            if self.items[i].key == key:
                self.items.pop(i)
                return

    def add_item(self, item=None):
        self.items.append(item)


import { shallowMount } from '@vue/test-utils'
import Game from './Game.vue'

describe('Game.vue', () => {
    test('renders props.msg when passed', () => {
        const title = 'DSnake4 - TESTING';
        const wrapper = shallowMount(Game, {
            propsData: { title }
        })
        expect(wrapper.text()).toMatch(title);
    })
})
import type { Meta, StoryObj } from '@storybook/react-vite'
import Login from './index'

const meta = {
  title: 'Mount Shop/Page/Login',
  component: Login,
  parameters: {
    layout: 'fullscreen'
  },
  tags: ['autodocs']
} satisfies Meta<typeof Login>

export default meta
export type Story = StoryObj<typeof meta>

export const Primay: Story = {}

import type { Meta, StoryObj } from '@storybook/react-vite'
import Register from './index'

const meta = {
  title: 'Mount Shop/Page/Register',
  component: Register,
  parameters: {
    layout: 'fullscreen'
  },
  tags: ['autodocs']
} satisfies Meta<typeof Register>

export default meta
export type Story = StoryObj<typeof meta>

export const Primay: Story = {}

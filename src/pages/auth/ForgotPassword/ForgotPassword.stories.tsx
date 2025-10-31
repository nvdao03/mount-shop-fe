import type { Meta, StoryObj } from '@storybook/react-vite'
import ForgotPassword from './index'

const meta = {
  title: 'Mount Shop/Page/ForgotPassword',
  component: ForgotPassword,
  parameters: {
    layout: 'fullscreen'
  },
  tags: ['autodocs']
} satisfies Meta<typeof ForgotPassword>

export default meta
export type Story = StoryObj<typeof meta>

export const Primay: Story = {}

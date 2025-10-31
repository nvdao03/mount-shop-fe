import type { Meta, StoryObj } from '@storybook/react-vite'

import InputAuth from './index'
import { useForm } from 'react-hook-form'

const meta = {
  title: 'Mount Shop/InputAuth',
  component: InputAuth,
  parameters: {
    layout: 'centered'
  },
  tags: ['autodocs'],
  args: {
    label: '',
    register: () => ({}),
    classNameInput: '',
    classNameLabel: '',
    classNameError: '',
    classNameErrorMessage: '',
    errors: undefined,
    name: '',
    type: '',
    errorMessage: '',
    placeholder: '',
    messageForgotPassword: ''
  },
  argTypes: {
    name: { control: 'text' },
    label: { control: 'text' },
    placeholder: { control: 'text' },
    type: { control: 'text' },
    errorMessage: { control: 'text' }
  }
} satisfies Meta<typeof InputAuth>

export default meta
type Story = StoryObj<typeof meta>

// Story mặc định
export const Default: Story = {
  render: (args) => {
    const { register } = useForm()
    return <InputAuth {...args} register={register} />
  },
  args: {
    name: 'password',
    label: 'Mật khẩu',
    placeholder: 'Nhập mật khẩu',
    type: 'password',
    classNameLabel: 'block text-sm mb-1',
    classNameInput:
      'text-[15px] w-full h-full border border-solid border-[#B3B3B3] placeholder:text-[#666] placeholder:text-sm rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 outline-none',
    classNameError: 'mt-2 flex items-center gap-1',
    classNameErrorMessage: 'text-red-500 text-[13px]'
  }
}

// Story có lỗi hiển thị
export const WithError: Story = {
  render: (args) => {
    const { register } = useForm()
    return <InputAuth {...args} register={register} />
  },
  args: {
    ...Default.args,
    errorMessage: 'Email là bắt buộc',
    errors: true
  }
}

// Story có link "Quên mật khẩu"
export const WithForgotPassword: Story = {
  render: (args) => {
    const { register } = useForm()
    return <InputAuth {...args} register={register} />
  },
  args: {
    ...Default.args,
    messageForgotPassword: 'Quên mật khẩu?'
  }
}

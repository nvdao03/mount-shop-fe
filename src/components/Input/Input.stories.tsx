import type { Meta, StoryObj } from '@storybook/react-vite'

import Input from './index'
import { useForm } from 'react-hook-form'

// Khai báo metadata cho component
const meta = {
  title: 'Mount Shop/Input',
  component: Input,
  parameters: {
    layout: 'centered' // căn giữa trong Storybook UI
  },
  tags: ['autodocs'],
  // Là giá trị mặc định của các props khi render component trong story.
  args: {
    label: '',
    customHeight: '',
    register: () => ({}),
    classNameInput: '',
    classNameLabel: '',
    classNameError: '',
    classNameErrorMessage: '',
    errors: undefined,
    errorMessage: '',
    disabled: false,
    multiple: false,
    handleOnChangeSubmitImage: () => {}
  },
  // argTypes: là cách hiển thị control cho từng prop (text box, checkbox, dropdown,…) => tức là các giá trị có thể sửa đổi trên UI Storybook
  argTypes: {
    name: { control: 'text' },
    label: { control: 'text' },
    placeholder: { control: 'text' },
    disabled: { control: 'boolean' },
    type: { control: 'text' },
    errorMessage: { control: 'text' }
  }
} satisfies Meta<typeof Input>

export default meta
type Story = StoryObj<typeof meta>

// Story cơ bản
export const Default: Story = {
  render: (args) => {
    const { register } = useForm()
    return <Input {...args} register={register} errors={undefined} />
  },
  args: {
    name: 'email',
    errors: false,
    label: 'Email',
    placeholder: 'Enter your email',
    type: 'email',
    classNameLabel: 'block mb-2 text-sm font-medium text-gray-900',
    classNameInput: 'w-72 border border-gray-300 rounded-lg p-2 focus:outline-none focus:border-blue-500',
    classNameError: 'flex items-center gap-1 mt-1',
    classNameErrorMessage: 'text-sm text-red-500'
  }
}

// Story có lỗi hiển thị
export const WithError: Story = {
  args: {
    ...Default.args,
    errorMessage: 'Email is required',
    errors: true
  }
}

// Story bị disable
export const Disabled: Story = {
  args: {
    ...Default.args,
    disabled: true
  }
}

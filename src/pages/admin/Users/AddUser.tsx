import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import InputAuth from '../../../components/InputAuth'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { toast } from 'react-toastify'
import { ADMIN_MESSAGE } from '../../../constants/message'
import { useNavigate } from 'react-router-dom'
import { PATH } from '../../../constants/path'
import { schemaAdminAddUser, type TypeAdminAddUser } from '../../../validation/user'
import { adminRoleApi } from '../../../apis/admin/roles.api'
import type { RoleType } from '../../../types/role.type'
import { adminUserApi } from '../../../apis/admin/user.api'
import { ROLES } from '../../../constants/other'

export default function AddUser() {
  const queryClient = useQueryClient()
  const navigate = useNavigate()

  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm({
    resolver: yupResolver(schemaAdminAddUser)
  })

  // --- Mutation Add User --- //
  const addUserMutation = useMutation({
    mutationFn: (data: TypeAdminAddUser) => adminUserApi.addUser(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['adminGetUsers'] })
      toast.success(ADMIN_MESSAGE.ADD_USER_SUCCESS, {
        style: {
          lineHeight: '1.5',
          fontSize: '16px'
        }
      })
      navigate(PATH.ADMIN_USERS)
    }
  })

  // --- Get Role --- //
  const getRoles = useQuery({
    queryKey: ['adminGetRoles'],
    queryFn: () => adminRoleApi.getRoles()
  })

  // --- Handle Submit Add User --- //
  const handleSubmitAddUser = handleSubmit((data: TypeAdminAddUser) => {
    addUserMutation.mutate(data)
  })

  const roles = (getRoles?.data?.data && (getRoles.data.data.data.roles as RoleType[])) || []

  return (
    <div className='h-full'>
      {/* --- Title --- */}
      <div className='px-4 text-[16px] py-6 justify-center flex items-center gap-3 border-b-[0.5px] border-solid border-[#E6E6E6] font-semibold'>
        Thêm Tài Khoản Người Dùng
      </div>
      {/* --- Form Submit Categories --- */}
      <form onSubmit={handleSubmitAddUser} className='p-4 flex flex-col gap-5'>
        <InputAuth
          label='Họ và tên khách hàng'
          classNameLabel='block text-sm mb-1'
          classNameError='mt-2 flex items-center gap-1'
          classNameErrorMessage='text-red-500 text-[13px]'
          classNameInput='text-[15px] w-full h-full border border-solid border-[#B3B3B3] placeholder:text-[#666] placeholder:text-sm rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 outline-none'
          register={register}
          errorMessage={errors?.full_name?.message as string}
          type='text'
          name='full_name'
          errors={errors.full_name}
          placeholder='Nhập họ và tên'
        />
        <InputAuth
          label='Email'
          classNameLabel='block text-sm mb-1'
          classNameError='mt-2 flex items-center gap-1'
          classNameErrorMessage='text-red-500 text-[13px]'
          classNameInput='text-[15px] w-full h-full border border-solid border-[#B3B3B3] placeholder:text-[#666] placeholder:text-sm rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 outline-none'
          register={register}
          errorMessage={errors?.email?.message as string}
          type='email'
          name='email'
          errors={errors.email}
          placeholder='Nhập địa chỉ email'
        />
        <InputAuth
          label='Mật khẩu'
          classNameLabel='block text-sm mb-1'
          classNameError='mt-2 flex items-center gap-1'
          classNameErrorMessage='text-red-500 text-[13px]'
          classNameInput='text-[15px] w-full h-full border border-solid border-[#B3B3B3] placeholder:text-[#666] placeholder:text-sm rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 outline-none'
          register={register}
          errorMessage={errors?.password?.message as string}
          type='password'
          name='password'
          errors={errors.password}
          placeholder='Nhập mật khẩu'
        />
        <div>
          <label className='block text-sm mb-1'>Vai trò</label>
          <select
            {...register('role_id')}
            className='w-full border border-solid border-[#B3B3B3] px-3 py-[9px] rounded-lg cursor-pointer focus:ring-2 focus:ring-blue-500 outline-none text-[15px]'
          >
            <option value='' className='text-[#666]'>
              Chọn vai trò
            </option>
            {roles.map((role: RoleType) => (
              <option value={role.id} key={role.id}>
                {role.name === ROLES.CUSTOMER ? 'Khách hàng' : role.name === ROLES.ADMIN ? 'Quản trị viên' : role.name}
              </option>
            ))}
          </select>
        </div>

        <button className='flex-1 max-w-[180px] ml-auto bg-[#4F46E5] w-full mt-auto text-white rounded-lg py-3 text-center font-semibold'>
          Thêm người dùng
        </button>
      </form>
    </div>
  )
}

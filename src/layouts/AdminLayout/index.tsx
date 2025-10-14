import SidebarAdmin from '../../pages/admin/components/SidebarAdmin'

interface PropTypes {
  children: React.ReactNode
}

function AdminLayout({ children }: PropTypes) {
  return (
    <div className=' bg-[#F5F5FA] h-[100vh] py-4'>
      <main className='max-w-[1320px] mx-auto px-4 grid grid-cols-12 gap-3 h-full'>
        <section className='col-span-3 bg-white h-full rounded-[10px]'>
          <SidebarAdmin />
        </section>
        <section className='col-span-9 bg-white h-full rounded-[10px]'>{children}</section>
      </main>
    </div>
  )
}

export default AdminLayout

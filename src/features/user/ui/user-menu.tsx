import { UserIcon } from 'lucide-react'
import { Button } from '@/shared/components/ui/button'
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/shared/components/ui/sheet'

export function UserMenu() {
  return (
    <Sheet>
      <SheetTrigger asChild>
        <button className='border-primary hover:border-primary-foreground flex size-8 cursor-pointer items-center justify-center rounded border transition-colors'>
          <UserIcon className='size-4' />
        </button>
      </SheetTrigger>

      <SheetContent className='w-[320px] rounded-l'>
        <SheetHeader>
          <SheetTitle>Profile</SheetTitle>
          <SheetDescription>
            Make changes to your profile here. Click save when you&apos;re done.
          </SheetDescription>
        </SheetHeader>
        <SheetFooter>
          <Button type='submit'>Save changes</Button>
          <SheetClose asChild>
            <Button variant='outline'>Close</Button>
          </SheetClose>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  )
}

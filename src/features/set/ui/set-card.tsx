import { EllipsisVerticalIcon, PinIcon, SettingsIcon } from 'lucide-react'
import { type Set } from '@/entities/set'
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/shared/components/ui/card'

type Props = {
  set: Set
}

export const SetCard = ({ set }: Props) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{`(${set.contentStatus}) ${set.name}`}</CardTitle>
        <CardDescription>{set.description}</CardDescription>
        <CardAction>...</CardAction>
      </CardHeader>

      <CardContent>
        <p>Card Content</p>
      </CardContent>

      <CardFooter className='justify-between'>
        <SettingsIcon />

        <ul className='flex items-center gap-2'>
          <li>Preview</li>
          <li>
            <PinIcon />
          </li>
          <li>
            <EllipsisVerticalIcon />
          </li>
        </ul>
      </CardFooter>
    </Card>
  )
}

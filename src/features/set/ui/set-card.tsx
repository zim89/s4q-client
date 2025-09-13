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
        <CardTitle>{set.name}</CardTitle>
        <CardDescription>Card Description</CardDescription>
        <CardAction>...</CardAction>
      </CardHeader>
      {/* <CardContent>
        <p>Card Content</p>
      </CardContent> */}
      <CardFooter>
        <p>Card Footer</p>
      </CardFooter>
    </Card>
  )
}

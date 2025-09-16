'use client'

import { useEffect } from 'react'
import { zodResolver } from '@hookform/resolvers/zod'
import { Trash2Icon } from 'lucide-react'
import { useForm } from 'react-hook-form'
import { useLanguages } from '@/features/language'
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/shared/components/ui'
import { Button } from '@/shared/components/ui/button'
import { Checkbox } from '@/shared/components/ui/checkbox'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/shared/components/ui/form'
import { Input } from '@/shared/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/shared/components/ui/select'
import { Textarea } from '@/shared/components/ui/textarea'
import { languageLevels } from '@/shared/constants'
import { type CreateSetFormData, createSetSchema } from '../lib/schema'

export const CreateSetForm = () => {
  const form = useForm<CreateSetFormData>({
    resolver: zodResolver(createSetSchema),
    defaultValues: {
      name: '',
      description: '',
      isBase: undefined,
      isPublic: undefined,
      level: undefined,
      cards: [
        { newCard: { term: '', translate: '', definition: '' } },
        { newCard: { term: '', translate: '', definition: '' } },
      ],
    },
  })

  const handleSubmit = (data: CreateSetFormData) => {
    console.log('🚸 Form data', data)
  }

  const { languages } = useLanguages()

  useEffect(() => {
    console.log('🚸 Languages', languages)
  }, [languages])

  const addCard = () => {
    const currentCards = form.getValues('cards')
    form.setValue('cards', [
      ...currentCards,
      { newCard: { term: '', translate: '', definition: '' } },
    ])
  }

  const removeCard = (index: number) => {
    const currentCards = form.getValues('cards')
    if (currentCards.length > 2) {
      form.setValue(
        'cards',
        currentCards.filter((_, i) => i !== index),
      )
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className='space-y-6'>
        <div className='flex items-center justify-between'>
          <h1 className='page-title'>Create a new flashcard set</h1>
          <Button type='submit'>Create Set</Button>
        </div>

        {/* TITLE FIELD */}
        <FormField
          control={form.control}
          name='name'
          render={({ field }) => (
            <FormItem>
              <FormLabel>Title</FormLabel>
              <FormControl>
                <Input
                  placeholder='Enter a title, like "Chemistry - Chapter 13"'
                  {...field}
                  disabled={false}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* DESCRIPTION FIELD */}
        <FormField
          control={form.control}
          name='description'
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description</FormLabel>
              <FormControl>
                <Textarea
                  placeholder='Describe what this set studies'
                  className=''
                  {...field}
                  disabled={false}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name='level'
          render={({ field }) => (
            <FormItem>
              <FormLabel>Difficulty Level</FormLabel>
              <Select
                onValueChange={field.onChange}
                defaultValue={field.value}
                disabled={false}
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder='Select difficulty level' />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {Object.entries(languageLevels).map(([key, value]) => (
                    <SelectItem key={key} value={value}>
                      {value}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className='space-y-4'>
          <FormField
            control={form.control}
            name='isPublic'
            render={({ field }) => (
              <FormItem className='flex flex-row items-start space-y-0 space-x-3'>
                <FormControl>
                  <Checkbox
                    checked={field.value}
                    onCheckedChange={field.onChange}
                    disabled={false}
                  />
                </FormControl>
                <div className='space-y-1 leading-none'>
                  <FormLabel>Public Set</FormLabel>
                  <p className='text-muted-foreground text-sm'>
                    Set will be available to all users
                  </p>
                </div>
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name='isBase'
            render={({ field }) => (
              <FormItem className='flex flex-row items-start space-y-0 space-x-3'>
                <FormControl>
                  <Checkbox
                    checked={field.value}
                    onCheckedChange={field.onChange}
                    disabled={false}
                  />
                </FormControl>
                <div className='space-y-1 leading-none'>
                  <FormLabel>Base Set</FormLabel>
                  <p className='text-muted-foreground text-sm'>
                    System card collection
                  </p>
                </div>
              </FormItem>
            )}
          />
        </div>

        {/* CARDS SECTION */}
        <div className='space-y-4'>
          <div className='flex items-center justify-between'>
            <h3 className='text-lg font-semibold'>Cards</h3>
            <Button type='button' variant='outline' onClick={addCard}>
              Add Card
            </Button>
          </div>

          {form.watch('cards').map((_, index) => (
            <Card key={index}>
              <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-4'>
                <CardTitle className='text-base font-medium'>
                  Card #{index + 1}
                </CardTitle>

                <Button
                  type='button'
                  variant='ghost'
                  size='sm'
                  onClick={() => removeCard(index)}
                  disabled={form.watch('cards').length <= 2}
                  className='text-destructive hover:text-destructive'
                >
                  <Trash2Icon />
                </Button>
              </CardHeader>
              <CardContent className='space-y-4'>
                <div className='grid grid-cols-1 gap-4 md:grid-cols-2'>
                  <FormField
                    control={form.control}
                    name={`cards.${index}.newCard.term`}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Term</FormLabel>
                        <FormControl>
                          <Input
                            placeholder='Enter term'
                            {...field}
                            disabled={false}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name={`cards.${index}.newCard.translate`}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Translation</FormLabel>
                        <FormControl>
                          <Input
                            placeholder='Enter translation'
                            {...field}
                            disabled={false}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={form.control}
                  name={`cards.${index}.newCard.definition`}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Definition</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder='Enter definition'
                          className='min-h-[80px]'
                          {...field}
                          disabled={false}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </CardContent>
            </Card>
          ))}
        </div>

        <div className='flex justify-end gap-3'>
          <Button
            type='button'
            variant='outline'
            onClick={() => form.reset()}
            disabled={false}
          >
            Clear
          </Button>
          <Button type='submit'>Create Set</Button>
        </div>
      </form>
    </Form>
  )
}

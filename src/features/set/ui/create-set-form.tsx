'use client'

import { useEffect } from 'react'
import { zodResolver } from '@hookform/resolvers/zod'
import { ImageIcon, MicIcon, SettingsIcon, Trash2Icon } from 'lucide-react'
import { useForm } from 'react-hook-form'
import { useLanguages } from '@/features/language'
import { TextEditor } from '@/shared/components/editor/text-editor'
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
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/shared/components/ui/popover'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/shared/components/ui/select'
import { Textarea } from '@/shared/components/ui/textarea'
import { languageLevels, partsOfSpeech, verbTypes } from '@/shared/constants'
import { defaultNewCard, defaultSetForm } from '../lib/constants'
import { type CreateSetFormData, createSetSchema } from '../lib/schema'

export const CreateSetForm = () => {
  const { languages } = useLanguages()

  const form = useForm<CreateSetFormData>({
    resolver: zodResolver(createSetSchema),
    defaultValues: defaultSetForm,
  })

  const handleSubmit = (data: CreateSetFormData) => {
    console.log('🚸 Form data', data)
  }

  const addCard = () => {
    const currentCards = form.getValues('cards')

    form.setValue('cards', [
      ...currentCards,
      { newCard: { ...defaultNewCard } },
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

  // Watch form changes
  const formValues = form.watch()

  useEffect(() => {
    console.log('🚸 Form state changed:', formValues)
  }, [formValues])

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
                <div className='flex items-center gap-2'>
                  <Popover>
                    <PopoverTrigger>
                      <SettingsIcon />
                    </PopoverTrigger>
                    <PopoverContent className='w-[300px]'>
                      <div className='grid grid-cols-1 gap-4'>
                        <div className='grid grid-cols-2 gap-4'>
                          {/* IMAGE */}
                          <div className='flex h-10 cursor-pointer items-center justify-center gap-2 rounded-md border border-dashed text-sm'>
                            <ImageIcon className='size-4 opacity-50' />
                            <span>Image</span>
                          </div>
                          {/* AUDIO */}
                          <div className='flex h-10 cursor-pointer items-center justify-center gap-2 rounded-md border border-dashed text-sm'>
                            <MicIcon className='size-4 opacity-50' />
                            <span>Audio</span>
                          </div>
                        </div>

                        {/* LEVEL */}
                        <FormField
                          control={form.control}
                          name={`cards.${index}.newCard.level`}
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Level</FormLabel>
                              <Select
                                onValueChange={field.onChange}
                                value={field.value}
                              >
                                <FormControl>
                                  <SelectTrigger className='w-full'>
                                    <SelectValue placeholder='Select ...' />
                                  </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                  {Object.entries(languageLevels).map(
                                    ([key, value]) => (
                                      <SelectItem key={key} value={value}>
                                        {value}
                                      </SelectItem>
                                    ),
                                  )}
                                </SelectContent>
                              </Select>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        {/* PART OF SPEECH */}
                        <FormField
                          control={form.control}
                          name={`cards.${index}.newCard.partOfSpeech`}
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Part of Speech</FormLabel>
                              <Select
                                onValueChange={field.onChange}
                                value={field.value}
                              >
                                <FormControl>
                                  <SelectTrigger className='w-full'>
                                    <SelectValue placeholder='Select ...' />
                                  </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                  {Object.entries(partsOfSpeech).map(
                                    ([key, value]) => (
                                      <SelectItem key={key} value={value}>
                                        {value}
                                      </SelectItem>
                                    ),
                                  )}
                                </SelectContent>
                              </Select>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        {/* VERB TYPE */}
                        {form.watch(`cards.${index}.newCard.partOfSpeech`) ===
                          partsOfSpeech.verb && (
                          <FormField
                            control={form.control}
                            name={`cards.${index}.newCard.verbType`}
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Verb Type</FormLabel>
                                <Select
                                  onValueChange={field.onChange}
                                  value={field.value}
                                >
                                  <FormControl>
                                    <SelectTrigger className='w-full'>
                                      <SelectValue placeholder='Select verb type' />
                                    </SelectTrigger>
                                  </FormControl>
                                  <SelectContent>
                                    {Object.entries(verbTypes).map(
                                      ([key, value]) => (
                                        <SelectItem key={key} value={value}>
                                          {value}
                                        </SelectItem>
                                      ),
                                    )}
                                  </SelectContent>
                                </Select>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        )}

                        {/* Verb-specific fields - only show if part of speech is verb */}
                        {form.watch(`cards.${index}.newCard.partOfSpeech`) ===
                          partsOfSpeech.verb &&
                          form.watch(`cards.${index}.newCard.verbType`) ===
                            verbTypes.irregular && (
                            <>
                              {/* PAST SIMPLE */}
                              <FormField
                                control={form.control}
                                name={`cards.${index}.newCard.pastSimple`}
                                render={({ field }) => (
                                  <FormItem>
                                    <FormLabel>Past Simple</FormLabel>
                                    <FormControl>
                                      <Input
                                        placeholder='Enter past simple form'
                                        {...field}
                                      />
                                    </FormControl>
                                    <FormMessage />
                                  </FormItem>
                                )}
                              />

                              {/* PAST PARTICIPLE */}
                              <FormField
                                control={form.control}
                                name={`cards.${index}.newCard.pastParticiple`}
                                render={({ field }) => (
                                  <FormItem>
                                    <FormLabel>Past Participle</FormLabel>
                                    <FormControl>
                                      <Input
                                        placeholder='Enter past participle form'
                                        {...field}
                                      />
                                    </FormControl>
                                    <FormMessage />
                                  </FormItem>
                                )}
                              />
                            </>
                          )}
                      </div>

                      {/*  */}
                    </PopoverContent>
                  </Popover>
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
                </div>
              </CardHeader>
              <CardContent className='space-y-4'>
                {/* Core Fields */}
                <div className='grid grid-cols-1 gap-4 md:grid-cols-2'>
                  <FormField
                    control={form.control}
                    name={`cards.${index}.newCard.term`}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Term *</FormLabel>

                        <FormControl>
                          <Input
                            placeholder='Enter term'
                            {...field}
                            disabled={false}
                          />
                        </FormControl>

                        <div className='flex h-9 items-center justify-end'>
                          <FormField
                            control={form.control}
                            name={`cards.${index}.newCard.languageId`}
                            render={({ field }) => (
                              <FormItem>
                                <Select
                                  onValueChange={field.onChange}
                                  value={field.value}
                                >
                                  <FormControl>
                                    <SelectTrigger className='border-none shadow-none'>
                                      <SelectValue placeholder='Choose language' />
                                    </SelectTrigger>
                                  </FormControl>
                                  <SelectContent>
                                    {languages?.map(language => (
                                      <SelectItem
                                        key={language.id}
                                        value={language.id}
                                      >
                                        {language.name}
                                      </SelectItem>
                                    ))}
                                  </SelectContent>
                                </Select>
                              </FormItem>
                            )}
                          />
                        </div>

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
                        <div className='flex h-9 items-center justify-end'></div>

                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={form.control}
                  name={`cards.${index}.newCard.transcription`}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Transcription</FormLabel>
                      <FormControl>
                        <Input
                          placeholder='Enter phonetic transcription'
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
                  name={`cards.${index}.newCard.definition`}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Definition</FormLabel>
                      <FormControl>
                        <TextEditor
                          content={field.value || ''}
                          onChange={field.onChange}
                          placeholder='Enter definition'
                          className='min-h-[120px]'
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name={`cards.${index}.newCard.example`}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Example</FormLabel>
                      <FormControl>
                        <TextEditor
                          content={field.value || ''}
                          onChange={field.onChange}
                          placeholder='Enter example usage'
                          className='min-h-[120px]'
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

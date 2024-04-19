import { defineCollection, z } from 'astro:content'

const helpCollection = defineCollection({
  schema: z.object({
    title: z.string(),
  }),
})

export const collections = {
  help: helpCollection,
}

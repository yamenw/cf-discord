import { json } from 'sift'

export function hello(data: any) {
  const { value } = data?.options?.find(
    (option: { name: string; value: string }) => option.name === 'name'
  )
  return json({
    // Type 4 responds with the below message retaining the user's
    // input at the top.
    type: 4,
    data: {
      content: `Hello, ${value}!`,
    },
  })
}
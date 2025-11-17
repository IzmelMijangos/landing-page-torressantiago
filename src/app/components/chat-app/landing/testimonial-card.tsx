import Image from "next/image"

type TestimonialProps = {
  quote: string
  author: string
  role: string
  company: string
  avatar: string
}

export default function TestimonialCard({ quote, author, role, company, avatar }: TestimonialProps) {
  return (
    <div className="bg-white dark:bg-dark-light rounded-lg shadow-md p-6 flex flex-col h-full">
      <div className="flex-1">
        <p className="text-gray-600 dark:text-gray-300 italic mb-4">"{quote}"</p>
      </div>
      <div className="flex items-center mt-4">
        <div className="w-12 h-12 relative rounded-full overflow-hidden mr-4">
          <Image src={avatar || "/placeholder.svg"} alt={author} fill className="object-cover" />
        </div>
        <div>
          <h4 className="font-medium text-gray-900 dark:text-white">{author}</h4>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            {role}, {company}
          </p>
        </div>
      </div>
    </div>
  )
}

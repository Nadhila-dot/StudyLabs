import { LucideLink2 } from "lucide-react"
import type React from "react"

export interface Resource {
  id: number
  name: string
  preview_url: string
  subject?: string
  term?: string
  category: string
}

interface PaginatedResources {
  data: Resource[]
  current_page: number
  last_page: number
  // Add other pagination fields if needed
}

interface ResourcesListProps {
  resources?: PaginatedResources
}

const ResourcesList: React.FC<ResourcesListProps> = ({ resources }) => {
    if (!resources || !resources.data) {
      return (
        <div className="p-4 text-center">
          <p className="text-muted-foreground">No resources available</p>
        </div>
      )
    }
  
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {resources.data.map((resource) => (
          <div key={resource.id} className="border rounded shadow p-4">
            <h3 className="text-lg font-bold">{resource.name}</h3>
            <iframe
              src={resource.preview_url || "/placeholder.svg"}
              title={resource.name}
              className="w-full h-40"
            />
            <p className="text-sm">Category: {resource.category}</p>
            {resource.subject && <p className="text-sm">Subject: {resource.subject}</p>}
            {resource.term && <p className="text-sm">Term: {resource.term}</p>}
            <a
              href={resource.preview_url}
              target="_blank"
              rel="noopener noreferrer" 
              className="inline-flex items-center gap-2 mt-4 px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90"
            >
              Open Resource <LucideLink2 className="h-4 w-4" />
            </a>
          </div>
        ))}
      </div>
    )
  }
  
  export default ResourcesList
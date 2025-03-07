import { LucideLink2, ChevronLeft, ChevronRight } from "lucide-react"
import React, { useState, useMemo } from "react"
import { Button } from "@/components/ui/button"
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination"

export interface Resource {
  id: number
  name: string
  preview_url: string
  subject?: string
  term?: string
  category: string
}

interface ResourcesListProps {
  resources?: Resource[]
  itemsPerPage?: number
}

const ResourcesList: React.FC<ResourcesListProps> = ({ 
  resources = [], 
  itemsPerPage = 6  // Default to 9 items per page (3x3 grid)
}) => {
  const [currentPage, setCurrentPage] = useState(1);

  // Calculate pagination details
  const totalItems = resources.length;
  const lastPage = Math.ceil(totalItems / itemsPerPage);
  
  // Get current page's items
  const currentItems = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = Math.min(startIndex + itemsPerPage, totalItems);
    return resources.slice(startIndex, endIndex);
  }, [resources, currentPage, itemsPerPage, totalItems]);

  if (!resources || resources.length === 0) {
    return (
      <div className="p-4 text-center">
        <p className="text-muted-foreground">No resources available</p>
      </div>
    )
  }
  
  // Generate pagination items
  const renderPaginationItems = () => {
    const items = [];
    
    // Always show first page
    items.push(
      <PaginationItem key="first">
        <PaginationLink 
          href="#" 
          onClick={(e) => handlePageClick(e, 1)} 
          isActive={currentPage === 1}
        >
          1
        </PaginationLink>
      </PaginationItem>
    );

    // If there are many pages, show ellipsis after first page
    if (currentPage > 3) {
      items.push(
        <PaginationItem key="ellipsis-1">
          <PaginationEllipsis />
        </PaginationItem>
      );
    }

    // Show pages around current page
    for (let i = Math.max(2, currentPage - 1); i <= Math.min(lastPage - 1, currentPage + 1); i++) {
      if (i === 1 || i === lastPage) continue; // Skip first and last as they're always shown
      
      items.push(
        <PaginationItem key={i}>
          <PaginationLink 
            href="#" 
            onClick={(e) => handlePageClick(e, i)} 
            isActive={currentPage === i}
          >
            {i}
          </PaginationLink>
        </PaginationItem>
      );
    }

    // If there are many pages, show ellipsis before last page
    if (currentPage < lastPage - 2 && lastPage > 3) {
      items.push(
        <PaginationItem key="ellipsis-2">
          <PaginationEllipsis />
        </PaginationItem>
      );
    }

    // Always show last page if it's not the first page
    if (lastPage > 1) {
      items.push(
        <PaginationItem key="last">
          <PaginationLink 
            href="#" 
            onClick={(e) => handlePageClick(e, lastPage)} 
            isActive={currentPage === lastPage}
          >
            {lastPage}
          </PaginationLink>
        </PaginationItem>
      );
    }

    return items;
  };

  const handlePageClick = (
    e: React.MouseEvent<HTMLAnchorElement>,
    page: number
  ) => {
    e.preventDefault();
    if (page !== currentPage) {
      setCurrentPage(page);
      // Scroll to top of the list
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };
  
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {currentItems.map((resource) => (
          <div key={resource.id} className="border rounded-lg shadow-sm p-4 hover:shadow-md transition-shadow">
            <h3 className="text-lg font-bold mb-2">{resource.name}</h3>
            <div className="relative aspect-video mb-3 bg-muted rounded overflow-hidden">
              <iframe
                src={resource.preview_url || "/placeholder.svg"}
                title={resource.name}
                className="w-full h-full absolute inset-0"
                loading="lazy"
              />
            </div>
            <div className="space-y-1 mb-4">
              <p className="text-sm text-muted-foreground">
                <span className="font-medium">Category:</span> {resource.category}
              </p>
              {resource.subject && (
                <p className="text-sm text-muted-foreground">
                  <span className="font-medium">Subject:</span> {resource.subject}
                </p>
              )}
              {resource.term && (
                <p className="text-sm text-muted-foreground">
                  <span className="font-medium">Term:</span> {resource.term}
                </p>
              )}
            </div>
            <a
              href={resource.preview_url}
              target="_blank"
              rel="noopener noreferrer" 
              className="inline-flex items-center gap-2 mt-2 px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors"
            >
              Open Resource <LucideLink2 className="h-4 w-4" />
            </a>
          </div>
        ))}
      </div>
      
      {/* Shadcn Pagination */}
      {lastPage > 1 && (
        <Pagination className="mt-8">
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious 
                href="#" 
                onClick={(e) => handlePageClick(e, Math.max(1, currentPage - 1))}
                aria-disabled={currentPage === 1}
                className={currentPage === 1 ? "pointer-events-none opacity-50" : ""}
              />
            </PaginationItem>
            
            {renderPaginationItems()}
            
            <PaginationItem>
              <PaginationNext 
                href="#" 
                onClick={(e) => handlePageClick(e, Math.min(lastPage, currentPage + 1))}
                aria-disabled={currentPage === lastPage}
                className={currentPage === lastPage ? "pointer-events-none opacity-50" : ""}
              />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      )}
    </div>
  )
}

export default ResourcesList
// import { Input } from "@/components/ui/input"
// import { Select, SelectItem, SelectTrigger, SelectValue, SelectContent } from "@/components/ui/select"
// import { useCategory } from "@/features/courses/hooks/useCourses"
// import { useDebounce } from "@/lib/hooks/useDebounce"
// import { LoadingSpinner } from "../shared/LoadingSpinner"

// interface Props {
//     filters: Record<string, any>
//     setFilters: (f: any) => void
// }

// export const CourseFilters = ({ filters, setFilters }: Props) => {
//     const debounced = useDebounce(filters.search, 400)
//     const { data, isLoading: categoryLoading } = useCategory()

//     console.log(data, "Cate");

//     return (
//         <div className="flex flex-col md:flex-row gap-4 mb-6">
//             <Input
//                 placeholder="Rechercher un cours..."
//                 value={filters.search}
//                 onChange={(e) => setFilters((f: any) => ({ ...f, search: e.target.value }))}
//             />

//             {categoryLoading ? <LoadingSpinner /> : <Select
//                 onValueChange={(v: any) => setFilters((f: any) => ({ ...f, category_id: v == "all" ? undefined : v }))}
//             >
//                 <SelectTrigger>
//                     <SelectValue placeholder="Catégorie" />
//                 </SelectTrigger>
//                 <SelectContent>
//                     <SelectItem value="all">Toutes</SelectItem>
//                     {Array.isArray(data) && data?.map((c) => {
//                         return <SelectItem value={c?.id?.toString()}>{c?.name}</SelectItem>
//                     })}
//                 </SelectContent>
//             </Select>}
//         </div>
//     )
// }

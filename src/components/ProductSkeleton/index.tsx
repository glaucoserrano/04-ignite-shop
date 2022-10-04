import { ComponentProps } from "react";
import { ProductEskeletonContanier, SkeletonItem } from "./styles";

type ProductSkeletonProps = ComponentProps<typeof ProductEskeletonContanier>

export function ProductSkeleton({...props} : ProductSkeletonProps){
  return(
    <ProductEskeletonContanier {...props}>
      <SkeletonItem />
      <div> 
      <SkeletonItem />
      <SkeletonItem />
      </div>
    </ProductEskeletonContanier>
  )
}
import React, { useEffect, useRef, useState } from 'react'

const LazyImage: React.FC<
  React.DetailedHTMLProps<React.ImgHTMLAttributes<HTMLImageElement>, HTMLImageElement>
> = ({ src, ...other }) => {
  const [imgSrc, setImgSrc] = useState(
    src && require('@/assets/picture_fill.svg').default
  )

  const imgRef = useRef<HTMLImageElement>(null)

  useEffect(() => {
    const observer = new IntersectionObserver(enr => {
      if (enr[0].intersectionRatio > 0) {
        setTimeout(() => {
          setImgSrc(src)
          imgRef.current && observer.unobserve(imgRef.current)
        }, 200)
      }
    })

    imgRef.current && observer.observe(imgRef.current)
  }, [])

  return <img ref={imgRef} src={imgSrc} {...other} />
}

export default React.memo(LazyImage)

import Link from "next/link"

const House = (props) => {
  console.log("Props", props)
  return (
    <Link href='/houses/[id]' as={`/houses/${props.id}`}>
      <a>
        <img src={props.picture} width='100%' alt='Houser picture' />
        <p>
          {props.type} - {props.town}
        </p>
        <p>{props.title}</p>
        <p>
          {props.rating} ({props.reviewsCount})
        </p>

        <style jsx>
          {`
            img {
              height: 100%;
              max-width: 100%;
            }
          `}
        </style>
      </a>
    </Link>
  )
}

export default House

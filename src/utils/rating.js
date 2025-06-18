import { FaStar, FaRegStar, FaStarHalfAlt} from 'react-icons/fa'

const renderStars = (rating) => {
  const stars = []
  for (let i = 1; i <= 5; i++) {
    if (rating >= i) {
      stars.push(<FaStar key={i} color="#ffc107" />) // full star
    } else if (rating >= i - 0.5) {
      stars.push(<FaStarHalfAlt key={i} color="#ffc107" />) // half star
    } else {
      stars.push(<FaRegStar key={i} color="#ffc107" />) // empty star
    }
  }
  return stars
}

export {renderStars};
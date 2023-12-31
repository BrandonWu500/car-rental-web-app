import { useFavorite } from '@/hooks/useFavorite';
import { AiFillHeart, AiOutlineHeart } from 'react-icons/ai';

interface FavoriteButtonProps {
  listingId: string;
}

const FavoriteButton = ({ listingId }: FavoriteButtonProps) => {
  const { hasFavorited, toggleFavorite } = useFavorite({
    listingId,
  });

  return (
    <button
      onClick={toggleFavorite}
      className="relative transition hover:opacity-80"
      aria-label={hasFavorited ? 'unfavorite' : 'favorite'}
    >
      <AiOutlineHeart
        size={28}
        className="absolute -right-[2px] -top-[2px] fill-white"
      />
      <AiFillHeart
        size={24}
        className={hasFavorited ? 'fill-rose-500' : 'fill-neutral-500/70'}
      />
    </button>
  );
};
export default FavoriteButton;

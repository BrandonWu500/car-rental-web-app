import Container from '@/components/Container';
import EmptyState from '@/components/EmptyState';
import Heading from '@/components/Heading';
import Grid from '@/components/layout/Grid';
import ListingCard from '@/components/listings/ListingCard';
import { useCars } from '@/hooks/useCars';
import { useCurrentUser } from '@/hooks/useCurrentUser';
import { useUnlistCar } from '@/hooks/useUnlistCar';
import { SafeTypeCar } from '@/types';
import { useRouter } from 'next/router';
import { ClipLoader } from 'react-spinners';

const CarsPage = () => {
  const { data: currentUser, isLoading: loadingUser } = useCurrentUser();
  const { cars, isLoading: loadingCars } = useCars(currentUser?.id);
  const { isLoading, onDelete } = useUnlistCar();
  const router = useRouter();

  if (loadingCars || loadingUser) {
    return (
      <div className="flex h-screen w-screen -translate-y-20 items-center justify-center">
        <ClipLoader size={250} />
      </div>
    );
  }

  if (!currentUser) {
    return (
      <EmptyState
        title="Unauthorized"
        subtitle="Please login to view this page."
      />
    );
  }

  if (cars?.length === 0) {
    return (
      <EmptyState
        title="No cars found"
        subtitle={`Looks like you haven't listed any cars yet.`}
      />
    );
  }
  return (
    <Container>
      <Heading title="Cars" subtitle="You have listed" />

      <Grid>
        {cars.map((car: SafeTypeCar) => (
          <ListingCard
            key={car.id}
            reservation={car.reservation}
            listing={car}
            actionId={car.id}
            actionLabel="Unlist Car"
            onAction={onDelete}
            disabled={isLoading}
            secondaryActionId={car.id}
            secondaryActionLabel="View reservations"
            onSecondaryAction={() => {
              router.push(`/cars/${car.id}`);
            }}
          />
        ))}
      </Grid>
    </Container>
  );
};
export default CarsPage;

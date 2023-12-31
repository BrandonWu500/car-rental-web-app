import Container from '@/components/Container';
import Heading from '@/components/Heading';
import { useReservationsByListingId } from '@/hooks/useReservationsByListingId';
import { serverAuth } from '@/libs/serverAuth';
import {
  GetServerSidePropsContext,
  NextApiRequest,
  NextApiResponse,
} from 'next';
import { useRouter } from 'next/router';
import { ClipLoader } from 'react-spinners';

import EmptyState from '@/components/EmptyState';
import Grid from '@/components/layout/Grid';
import ListingCard from '@/components/listings/ListingCard';
import { useDeleteReservation } from '@/hooks/useDeleteReservation';
import { prisma } from '@/libs/prismadb';
import { SafeTypeReservation } from '@/types';

export const getServerSideProps = async (ctx: GetServerSidePropsContext) => {
  const { query, req, res } = ctx;
  const { listingId } = query;

  const currentUser = await serverAuth(
    req as NextApiRequest,
    res as NextApiResponse
  );

  if (!listingId || typeof listingId !== 'string')
    return {
      redirect: {
        permanent: false,
        destination: '/400',
      },
    };

  if (!currentUser)
    return {
      redirect: {
        permanent: false,
        destination: '/401',
      },
    };

  const listing = await prisma.listing.findUnique({
    where: { id: listingId },
  });

  if (!listing) {
    return {
      redirect: {
        permanent: false,
        destination: '/500',
      },
    };
  }

  if (listing.userId !== currentUser.id)
    return {
      redirect: {
        permanent: false,
        destination: '/403',
      },
    };

  return {
    props: {},
  };
};

const CarReservationsPage = () => {
  const router = useRouter();
  const { listingId } = router.query;

  const {
    reservations,
    isLoading: loadingReservations,
    mutate,
  } = useReservationsByListingId(listingId as string);

  const { isLoading, onDelete } = useDeleteReservation(reservations, mutate);

  if (!reservations || loadingReservations) {
    return (
      <div className="flex h-screen w-screen -translate-y-20 items-center justify-center">
        <ClipLoader size={250} />
      </div>
    );
  }

  if (reservations?.length === 0) {
    return (
      <EmptyState
        title="No reservations found"
        subtitle={`Looks like you have no reservations on your car yet.`}
      />
    );
  }

  return (
    <Container>
      <Heading title="Reservations" subtitle="Made on your car" />
      <Grid>
        {reservations.map((reservation: SafeTypeReservation) => (
          <ListingCard
            key={reservation.id}
            listing={reservation.listing}
            reservation={reservation}
            actionId={reservation.id}
            onAction={onDelete}
            disabled={isLoading}
            actionLabel={`Cancel ${
              reservation.user?.name ?? 'user'
            }'s reservation`}
          />
        ))}
      </Grid>
    </Container>
  );
};
export default CarReservationsPage;

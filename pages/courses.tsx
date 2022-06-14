import Link from 'next/link';
import { useRouter } from 'next/router';
import { useState, useEffect, ReactNode } from 'react';
import { gql, GraphQLClient } from 'graphql-request';
import { GetStaticProps, GetStaticPaths } from 'next';
import LoadingDots from 'components/ui/LoadingDots';
import Button from 'components/ui/Button';
import { useUser } from 'utils/useUser';
import { postData } from 'utils/helpers';

const client = new GraphQLClient(
  process.env.NEXT_PUBLIC_GRAPH_CMS_URL as string
);

interface Props {
  title: string;
  description?: string;
  footer: ReactNode;
  children: ReactNode;
}

export default function Courses({ courses }) {
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { userLoaded, user, session, userDetails, subscription } = useUser();

  useEffect(() => {
    if (!user) router.replace('/signin');
    if (!subscription) router.replace('/account');
  }, [user, subscription]);

  return <section className="bg-black mb-32"></section>;
}

export const getStaticProps: GetStaticProps = async ({ params }) => {
  const query = gql`
    query Courses() {
      courses() {
        id
        slug
        coverImage { url }
        date
        title
      }
    }
    `;
  const data: { courses: any } = await client.request(query);
  console.log(data.courses);

  return {
    props: { courses: [...data.courses] },
    revalidate: 60 * 60 // Cache revalidate every hour
  };
};

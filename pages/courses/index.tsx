import Link from 'next/link';
import { useRouter } from 'next/router';
import { useState, useEffect, ReactNode } from 'react';
import { gql, GraphQLClient } from 'graphql-request';
import { GetStaticProps, GetStaticPaths } from 'next';
import { RichText } from '@graphcms/rich-text-react-renderer';

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

function CourseList({ courses }) {
  return (
    <div className="relative pt-16 pb-20 px-4 sm:px-6 lg:pt-24 lg:pb-28 lg:px-8">
      <div className="absolute inset-0">
        <div className="h-1/3 sm:h-2/3" />
      </div>
      <div className="relative max-w-7xl mx-auto">
        <div className="text-center">
          <h2 className="text-3xl tracking-tight font-extrabold sm:text-4xl">
            Courses
          </h2>
          <p className="mt-3 max-w-2xl mx-auto text-xl text-gray-500 sm:mt-4">
            Lorem ipsum dolor sit amet consectetur, adipisicing elit. Ipsa
            libero labore natus atque, ducimus sed.
          </p>
        </div>
        <div className="mt-12 max-w-lg mx-auto grid gap-5 lg:grid-cols-3 lg:max-w-none">
          {courses.map((post) => (
            <div
              key={post.title}
              className="flex flex-col rounded-lg shadow-lg overflow-hidden"
            >
              <div className="flex-shrink-0">
                <img
                  className="h-48 w-full object-cover"
                  src={post.coverImage.url}
                  alt=""
                />
              </div>
              <div className="flex-1 bg-gray-800 p-6 flex flex-col justify-between">
                <div className="flex-1">
                  <Link href={`/courses/${post.slug}`}>
                    <a className="block mt-2">
                      <p className="text-xl font-semibold ">{post.title}</p>
                      <p className="mt-3 text-base">{post.description.text}</p>
                    </a>
                  </Link>
                </div>
                {/* <div className="mt-6 flex items-center">
                  <div className="flex-shrink-0">
                    <a href={post.author.href}>
                      <span className="sr-only">{post.author.name}</span>
                      <img className="h-10 w-10 rounded-full" src={post.author.imageUrl} alt="" />
                    </a>
                  </div>
                  <div className="ml-3">
                    <p className="text-sm font-medium text-gray-900">
                      <a href={post.author.href} className="hover:underline">
                        {post.author.name}
                      </a>
                    </p>
                    <div className="flex space-x-1 text-sm text-gray-500">
                      <time dateTime={post.datetime}>{post.date}</time>
                      <span aria-hidden="true">&middot;</span>
                      <span>{post.readingTime} read</span>
                    </div>
                  </div>
                </div> */}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default function Courses({ courses }) {
  const router = useRouter();
  const { userLoaded, user, session, userDetails, subscription } = useUser();

  useEffect(() => {
    if (!user) router.replace('/signin');
    if (!subscription) router.replace('/account');
  }, [user, subscription]);

  return (
    <section className="bg-black mb-32">
      <CourseList courses={courses} />
    </section>
  );
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
        description { text }
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

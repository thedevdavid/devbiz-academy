import { gql } from 'graphql-request';
import { GetStaticPaths, GetStaticProps } from 'next';
import Image from 'next/image';
import React from 'react';

const Course = ({course}) => {
  if (!course) {
    return <p>No courses found.</p>;
  }

  return (
<div>
  <div className='max-w-2xl h-72 bg-gray-600'>
  <Image layout='fill' quality={80} src={course.coverImage.url} alt={`Cover image for ${course.title}`} />
  </div>
  <h1>{course.title}</h1>
  <div>{new Date(course.date).toISOString()}</div>
  <div dangerouslySetInnerHTML={{ __html: course.description.html}} />
</div>
  );
};

export const GetStaticPaths: GetStaticPaths = async () => {

  return {
    paths: [
      { params: { ... } }
    ],
    fallback: true // false or 'blocking'
  };
};

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


export default Course;

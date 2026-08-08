import React from 'react';
import { Container, PostForm } from '../components';

function AddPost() {
  return (
    <div className="w-full bg-[#f8f9ff] text-[#191c21] min-h-screen py-8 font-['Geist',sans-serif]">
      <Container>
        <header className="max-w-5xl mx-auto mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-[#191c21] mb-2 tracking-tight">
            Create New Post
          </h1>
          <p className="text-sm text-[#5a4138]">
            Share your technical insights and engineering updates with the Inkflow community.
          </p>
        </header>

        <PostForm />
      </Container>
    </div>
  );
}

export default AddPost;

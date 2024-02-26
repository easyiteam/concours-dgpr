import { useEffect, useId, useState } from 'react';
import { downloadPost, getPosts } from '../api/docs.api';
import { Icon } from './display/Icon';
import { Button } from './display/Button';

type Post = {
  id: string;
  createdAt: string;
  updatedAt: string;
  enabled: string;
  title: string;
  description: string;
  url: string;
  size: number;
  at?: string;
  views: number;
  downloads: number;
};

function formatFileSize(size: number) {
  if (size < 1024) return `${size} o`;
  if (size < 1024 * 1024) return `${(size / 1024).toFixed(2)} Ko`;
  return `${(size / (1024 * 1024)).toFixed(2)} Mo`;
}

export const Posts = () => {
  const [posts, setPosts] = useState<Post[]>([]);
  const id = useId();
  const [post, setPost] = useState<Post | null>(null);

  const load = async () => {
    const _posts = await getPosts();
    setPosts(_posts);
  };

  useEffect(() => {
    load();
  }, []);

  // const view = async (post: Post) => {
  //   await viewPost(post.id);
  //   // show in iframe
  //   axios.get(post.url, {responseType})
  //   setPost(post);
  //   await load();
  // };

  const download = async (post: Post) => {
    await downloadPost(post.id);
    window.open(post.url, '_blank');
    await load();
  };

  return (
    <div className="px-[6vw] py-4">
      <div className="text-4xl font-bold border-b border-gray-300 pb-4">
        Communiqués
      </div>
      {posts.map((post, index) => (
        <div
          key={`${id}_${index}`}
          className="my-10 border shadow-lg rounded p-6 flex items-start gap-4 lg:gap-8 bg-white">
          <Icon
            name="info"
            className="text-primary"
            size={32}
          />
          <div className="w-full">
            <div className="font-bold text-xs text-gray-700">{post.title}</div>
            <div className="text-justify mt-2 text-gray-500">
              {post.description}
            </div>
            <div className="flex flex-col-reverse lg:flex-row justify-between items-end">
              <div className="flex items-center gap-3 mt-4">
                {/* <Button
                  onClick={() => view(post)}
                  className="bg-transparent border shadow-none border-primary !text-primary text-xs lg:text-sm">
                  Lire
                </Button> */}
                <Button
                  onClick={() => download(post)}
                  className="bg-primary border shadow-none border-primary text-xs lg:text-sm">
                  Télécharger ({formatFileSize(post.size)})
                </Button>
              </div>
              <div className="flex items-center gap-6">
                {/* <div className="flex items-center gap-2">
                  <span>{post.views}</span>
                  <Icon name="visibility" />
                </div> */}

                <div className="flex items-center gap-2">
                  <span>{post.downloads}</span>
                  <Icon name="download" />
                </div>
              </div>
            </div>
          </div>
        </div>
      ))}

      {!!post && (
        <div className="fixed inset-0 bg-[#0000007F]">
          <div
            onClick={() => {
              setPost(null);
            }}>
            <Icon
              name="close"
              size={40}
              className="text-white fixed right-6 top-6"
            />
          </div>
          <iframe
            srcDoc={`${post.url}#toolbar=0&navpanes=0&scrollbar=0`}
            className="w-[80vw]"></iframe>
        </div>
      )}
    </div>
  );
};

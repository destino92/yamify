import React from 'react';
import { MDXProvider } from '@mdx-js/react';

// Définition des composants personnalisés pour MDX
const MDXComponents = {
  h1: (props: any) => <h1 className="mdx-content h1" {...props} />,
  h2: (props: any) => <h2 className="mdx-content h2" {...props} />,
  h3: (props: any) => <h3 className="mdx-content h3" {...props} />,
  p: (props: any) => <p className="mdx-content p" {...props} />,
  ul: (props: any) => <ul className="mdx-content ul" {...props} />,
  ol: (props: any) => <ol className="mdx-content ol" {...props} />,
  li: (props: any) => <li className="mdx-content li" {...props} />,
  a: (props: any) => <a className="mdx-content a" {...props} />,
  code: (props: any) => <code className="mdx-content code" {...props} />,
  pre: (props: any) => (
    <pre className="mdx-content pre" {...props} />
  ),
};

interface MDXWrapperProps {
  children: React.ReactNode;
}

// Composant wrapper pour MDX
const MDXWrapper: React.FC<MDXWrapperProps> = ({ children }) => {
  return (
    <MDXProvider components={MDXComponents}>
      {children}
    </MDXProvider>
  );
};

export default MDXWrapper;

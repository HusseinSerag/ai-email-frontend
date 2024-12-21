import { Helmet, HelmetData } from 'react-helmet-async'

interface HeadProps {
  title?: string
  description?: string
}

const helmetData = new HelmetData({})

export function Head({ title = '', description = '' }: HeadProps = {}) {
  return (
    <Helmet
      helmetData={helmetData}
      title={title ? `${title}` : ' Email AI '}
      defaultTitle="Email AI"
    >
      <meta name="description" content={description} />
    </Helmet>
  )
}

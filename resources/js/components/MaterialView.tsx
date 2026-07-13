import { Material } from "@/types/material";
import { dateFormat } from "@/utils/helperFunctions";
import { Alert, Skeleton, Tag } from "antd";
import axios from "axios";
import { useEffect, useState } from "react";


export default function MaterialView({ material, className = '' }: { material: Material, className?: string }) {

  const [data, setData] = useState<Material>();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const statusStyles: Record<string, string> = {
    submit: 'blue',
    publish: 'green',
    draft: 'default',
    return: 'red',
  }

  useEffect(() => {
    const controller = new AbortController();

    setLoading(true);
    setError('');
    setData(undefined);

    axios.get('/view-material/' + material.id, { signal: controller.signal })
      .then((res) => {
        if (res.data.success && res.data.data) {
          setData(res.data.data);
          return;
        }

        setError('Material preview is unavailable.');
      })
      .catch((error) => {
        if (axios.isCancel(error) || error.name === 'CanceledError') {
          return;
        }

        setError('Unable to load the material preview. Please try again.');
      })
      .finally(() => {
        if (!controller.signal.aborted) {
          setLoading(false);
        }
      });

    return () => controller.abort();
  }, [material])

  const publishDate = data?.publish_date ? dateFormat(data.publish_date as string) : null;
  const status = data?.status?.toLowerCase();

  return (
    <div className={`max-h-[72vh] overflow-y-auto pr-1 ${className}`}>
      {loading && (
        <div className="space-y-6 py-2">
          <div className="rounded-md border border-slate-200 bg-white p-5">
            <Skeleton active paragraph={{ rows: 2 }} title={{ width: '70%' }} />
            <div className="mt-5 grid gap-3 sm:grid-cols-3">
              <Skeleton.Button active block size="small" />
              <Skeleton.Button active block size="small" />
              <Skeleton.Button active block size="small" />
            </div>
          </div>

          <div className="rounded-md border border-slate-200 bg-white p-5">
            <Skeleton active paragraph={{ rows: 8 }} title={false} />
          </div>
        </div>
      )}

      {!loading && error && (
        <Alert
          type="error"
          showIcon
          message="Preview failed"
          description={error}
        />
      )}

      {!loading && !error && data && (
        <article className="space-y-6">
          <header className="rounded-md border border-slate-200 bg-slate-50 p-5">
            <div className="mb-3 flex flex-wrap items-center gap-2">
              {status && (
                <Tag color={statusStyles[status] ?? 'default'} className="m-0 uppercase">
                  {status}
                </Tag>
              )}

              {data.is_press_release ? (
                <Tag color="cyan" className="m-0">
                  Press Release
                </Tag>
              ) : null}

              {data.category?.category ? (
                <Tag className="m-0">
                  {data.category.category}
                </Tag>
              ) : null}
            </div>

            <h2 className="m-0 text-2xl font-bold leading-snug text-slate-950">
              {data.title}
            </h2>

            <div className="mt-4 grid gap-3 text-sm text-slate-700 sm:grid-cols-2 lg:grid-cols-3">
              <div>
                <div className="text-xs font-semibold uppercase tracking-wide text-slate-500">Author</div>
                <div className="font-medium text-slate-900">{data.author || 'Not specified'}</div>
              </div>

              <div>
                <div className="text-xs font-semibold uppercase tracking-wide text-slate-500">Publish Date</div>
                <div className="font-medium text-slate-900">{publishDate || 'Not scheduled'}</div>
              </div>

              {data.agency || data.region ? (
                <div>
                  <div className="text-xs font-semibold uppercase tracking-wide text-slate-500">Source</div>
                  <div className="font-medium text-slate-900">
                    {[data.agency, data.region].filter(Boolean).join(' / ')}
                  </div>
                </div>
              ) : null}
            </div>
          </header>

          <section className="rounded-md border border-slate-200 bg-white p-5">
            {data.description ? (
              <div
                className="ck ck-content relative max-w-none text-slate-800"
                dangerouslySetInnerHTML={{ __html: data.description }}
              />
            ) : (
              <div className="rounded-md border border-dashed border-slate-300 bg-slate-50 p-6 text-center text-sm text-slate-500">
                No preview content available.
              </div>
            )}
          </section>
        </article>
      )}
    </div>
  )
}

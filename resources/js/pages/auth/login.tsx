import { useState } from 'react'
import { Head, router } from '@inertiajs/react'

import {
  UserOutlined,
  LockOutlined,
  LoginOutlined,
  ExperimentOutlined,
  GlobalOutlined,
  ReadOutlined,
  SafetyCertificateOutlined,
} from '@ant-design/icons'

import { Alert, Button, Form, Input, Typography } from 'antd'
import ApplicationLogo from '@/components/application-logo'

const { Title, Text } = Typography
type LoginErrors = Record<string, string[]>;

export default function Login() {

  const [form] = Form.useForm()
  const [loading, setLoading] = useState(false)
  const [errors, setErrors] = useState<Record<string, string[]>>({})

  const submit = (values: Record<string, string>) => {
    setLoading(true)
    setErrors({})

    router.post('/login', values, {
      onError: (pageErrors) => {
        const mappedErrors: LoginErrors = {};

        for (const [key, value] of Object.entries(pageErrors)) {
          mappedErrors[key] = Array.isArray(value) ? value : [String(value)];
        }

        setErrors(mappedErrors);
      },
      onFinish: () => {
        setLoading(false);
      },
    });
  }

  return (
    <>
      <Head title="Login" />

      <div className="min-h-screen bg-[#eef4f1] px-4 py-8 text-slate-900">
        <div className="mx-auto grid min-h-[calc(100vh-4rem)] w-full max-w-6xl overflow-hidden rounded-xl border border-slate-200 bg-white shadow-xl lg:grid-cols-[1.08fr_0.92fr]">
          <section className="relative flex min-h-[520px] flex-col justify-between overflow-hidden bg-[#123f46] p-8 text-white md:p-10">
            <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-emerald-300 via-cyan-300 to-amber-300" />
            <div className="absolute inset-0 opacity-[0.08] [background-image:linear-gradient(#ffffff_1px,transparent_1px),linear-gradient(90deg,#ffffff_1px,transparent_1px)] [background-size:34px_34px]" />

            <div className="relative">
              <div className="inline-flex items-center gap-2 rounded-md border border-white/20 bg-white/10 px-3 py-2 text-sm font-medium text-cyan-50">
                <ExperimentOutlined />
                Science and Technology Knowledge
              </div>

              <div className="mt-12 max-w-xl">
                <p className="text-sm font-semibold uppercase tracking-[0.18em] text-cyan-100">
                  DOST-STII Knowledge Portal
                </p>
                <h1 className="mt-4 text-4xl font-semibold leading-tight text-white md:text-5xl">
                  Discover Knowledge. Inspire Innovation.
                </h1>
                <p className="mt-5 max-w-lg text-base leading-7 text-cyan-50/85">
                  A focused workspace for encoding, reviewing, and publishing science and technology materials.
                </p>
              </div>

              <div className="mt-10 grid max-w-2xl gap-3 sm:grid-cols-3">
                <div className="rounded-lg border border-white/15 bg-white/10 p-4">
                  <ReadOutlined className="text-xl text-amber-200" />
                  <div className="mt-3 text-sm font-semibold">Knowledge</div>
                  <div className="mt-1 text-xs leading-5 text-cyan-50/75">Organized materials for public information.</div>
                </div>
                <div className="rounded-lg border border-white/15 bg-white/10 p-4">
                  <GlobalOutlined className="text-xl text-emerald-200" />
                  <div className="mt-3 text-sm font-semibold">Reach</div>
                  <div className="mt-1 text-xs leading-5 text-cyan-50/75">Regional science updates in one place.</div>
                </div>
                <div className="rounded-lg border border-white/15 bg-white/10 p-4">
                  <SafetyCertificateOutlined className="text-xl text-cyan-200" />
                  <div className="mt-3 text-sm font-semibold">Review</div>
                  <div className="mt-1 text-xs leading-5 text-cyan-50/75">Clear roles from draft to publication.</div>
                </div>
              </div>
            </div>

            <div className="relative mt-12 rounded-xl border border-white/15 bg-white/10 p-5">
              <div className="mb-4 flex items-center justify-between gap-4">
                <div>
                  <div className="text-xs uppercase tracking-[0.16em] text-cyan-100">Editorial Flow</div>
                  <div className="mt-1 text-sm font-semibold text-white">Draft, submit, publish</div>
                </div>
                <div className="rounded-md bg-emerald-300/20 px-3 py-1 text-xs font-semibold text-emerald-100">
                  Active
                </div>
              </div>
              <div className="grid grid-cols-3 gap-2">
                {['Encode', 'Review', 'Release'].map((item, index) => (
                  <div key={item} className="rounded-md border border-white/15 bg-[#0c3036]/70 p-3">
                    <div className="text-lg font-semibold text-white">0{index + 1}</div>
                    <div className="mt-1 text-xs text-cyan-50/75">{item}</div>
                  </div>
                ))}
              </div>
            </div>
          </section>

          <section className="flex items-center justify-center bg-white p-6 md:p-10">
            <div className="w-full max-w-[420px]">
              <div className="mb-8">
                <ApplicationLogo className="max-w-[210px]" />
              </div>

              <div className="mb-7">
                <Title level={2} className="!mb-2 !text-slate-950">
                  Welcome back
                </Title>
                <Text className="text-base text-slate-600">
                  Sign in to continue managing content.
                </Text>
              </div>

              {Object.keys(errors).length > 0 && (
                <Alert
                  className="mb-5"
                  type="error"
                  showIcon
                  message="Unable to sign in"
                  description="Please check your username and password, then try again."
                />
              )}

              <Form
                form={form}
                layout="vertical"
                onFinish={submit}
                autoComplete="off"
                requiredMark={false}
              >
                <Form.Item
                  label={<span className="font-medium text-slate-700">Username</span>}
                  name="username"
                  validateStatus={errors?.username ? 'error' : ''}
                  help={errors?.username?.[0]}
                >
                  <Input
                    size="large"
                    placeholder="Enter your username"
                    prefix={<UserOutlined className="text-slate-400" />}
                    className="rounded-lg"
                  />
                </Form.Item>

                <Form.Item
                  label={<span className="font-medium text-slate-700">Password</span>}
                  name="password"
                  validateStatus={errors?.password ? 'error' : ''}
                  help={errors?.password?.[0]}
                >
                  <Input.Password
                    size="large"
                    placeholder="Enter your password"
                    prefix={<LockOutlined className="text-slate-400" />}
                    className="rounded-lg"
                  />
                </Form.Item>

                <Button
                  htmlType="submit"
                  type="primary"
                  size="large"
                  loading={loading}
                  block
                  icon={<LoginOutlined />}
                  className="mt-2 h-11 rounded-lg bg-[#0f766e] font-semibold hover:!bg-[#0d665f]"
                >
                  Sign In
                </Button>
              </Form>

              <div className="mt-8 rounded-lg border border-slate-200 bg-slate-50 px-4 py-3 text-sm leading-6 text-slate-600">
                Use your assigned account to access the workspace for your role.
              </div>

              <div className="mt-8 text-sm text-slate-500">
                Copyright {new Date().getFullYear()} DOST-STII. All rights reserved.
              </div>
            </div>
          </section>
        </div>
      </div>
    </>
  )
}

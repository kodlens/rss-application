import { Form, Input, Select, DatePicker, ConfigProvider,
  Button, Checkbox, Alert, Tag, notification,
  Modal} from "antd";
import Ckeditor from "./Ckeditor";
import { useEffect, useState } from "react";
import axios, { isAxiosError } from "axios";
import { router } from "@inertiajs/react";
import { ProjectOutlined, ArrowLeftOutlined } from "@ant-design/icons";
import dayjs from "dayjs";

import Classifier from "./Classifier";
import { Material } from "@/types/material";

import { dateFormat } from "@/utils/helperFunctions";
import { CreateEditProps } from "@/types/type";
import AuthorAutoComplete from "./author-autocomplete";
import AgencyAutoComplete from "./agency-autocomplete";
import InputTitleWithValidation from "./input-title-with-validation";
import { SelectFilterType } from "./select-filter-type";

const statusColors: Record<string, string> = {
  draft: 'default',
  submit: 'blue',
  publish: 'green',
  return: 'red',
}

const statusLabels: Record<string, string> = {
  draft: 'Draft',
  submit: 'Submitted',
  publish: 'Published',
  return: 'Returned',
}


const CreateEditMaterial = ({
  id,
  auth,
  material,
  ckLicense,
  agencies,
  regions,
  tags,
  uri
}: CreateEditProps) => {

  const [form] = Form.useForm();
  const [errors, setErrors] = useState<Record<string, string[]>>({});
  const [loading, setLoading] = useState<boolean>(false);

  const [notifApi, notifContextHolder] = notification.useNotification();
const [modal, modalContextHolder] = Modal.useModal();


  const role = auth.user?.role ? auth.user?.role.toLowerCase() : '';
  const isEditMode = Number(id) > 0;
  const watchedStatus = Form.useWatch('status', form);
  const currentStatus = (watchedStatus || material?.status || 'draft').toString().toLowerCase();
  const hasErrors = Object.keys(errors).length > 0;


  useEffect(() => {
    if (id > 0) {
      getData();
    }
  }, []);

  const getData = () => {
    try {
      form.setFields([
        { name:"resource_type", value: material.resource_type ? material.resource_type : 'article' },
        { name: "title", value: material.title },
        { name: "slug", value: material.slug },
        { name: "description", value: material.description },
        { name: "status", value: material.status ? material.status : 'draft' },
        { name: "source_url", value: material.source_url },
        { name: "category", value: material.category_id },
        { name: "subject_headings", value: material.subject_headings },
        { name: "agency", value: material.agency },
        { name: "region", value: material.region },
        { name: "author", value: material.author },
        { name: 'filter_type', value: material.filter_type ? material.filter_type : '' },
        { name: "is_publish", value: material.is_publish },
        { name: "tags", value: material.tags ? material.tags.split(',') : [] },
        { name: "is_press_release", value: material.is_press_release && material.is_press_release > 0 ? true : false },
        { name: "publish_date", value: material.publish_date ? dayjs(material.publish_date) : null },
      ]);
    } catch (err) {
      console.error(err);
    }
  };

  //submitSaveOnly is for admin and publisher only
  const handleSubmitSaveOnly = () => {
    form
      .validateFields()
      .then((values) => {
        submit({ ...values, is_publish: true, submit_status: 'save-only' });
      })
      .catch((info) => {
        console.error("Validate Failed:", info);
      });
  }

  const handleSubmitAndPublish = () => {
    form
      .validateFields()
      .then((values) => {
        submit({ ...values, is_publish: true, status: 'publish', submit_status: 'save-publish' });
      })
      .catch((info) => {
        console.error("Validate Failed:", info);
      });
  }

  const handleSubmitAndSetSubmit = () => {
    form
      .validateFields()
      .then((values) => {
        submit({ ...values, status: 'submit', submit_status: 'save-submit' });
      })
      .catch((info) => {
        console.error("Validate Failed:", info);
      });
  }

  const submit = (values: Material) => {
    setLoading(true)
    setErrors({});

    if (id > 0) {
      axios.patch(`${uri}/${id}`, values).then(res => {
        if (res.data.status === 'updated') {
          // modal.success({
          //   title: "Updated!",
          //   content: <div>Post successfully updated.</div>,
          //   onOk() {
          //     router.visit(`${uri}`);
          //   },
          // });
          notification.success({
            message: 'Updated!',
            description: 'Material successfully updated.',
            placement: 'topRight'
          })
        }
        setLoading(false)

      }).catch(err => {
        if (err.response.status === 422) {
          setErrors(err.response.data.errors);
        } else {
          notifApi['error']({
            message: 'Unable to save material',
            description: 'Please try again.',
            placement: 'topRight',
          })
        }
        setLoading(false);
      })

    } else {
      axios.post(`${uri}`, values).then(res => {
        console.log(res.data.status);

        if (res.data.status === 'saved') {
          modal.success({
            title: "Saved!",
            content: <div>Material successfully saved.</div>,
            onOk() {
              router.visit(`${uri}`);
            },
          });

        }
        setLoading(false)
      }).catch(err => {
        if(isAxiosError(err) && err.response?.status === 422) {
          setErrors(err.response.data.errors);
        }
       else {
          notification.error({
            title: 'Unable to save material',
            description: 'Please try again.',
            placement: 'topRight',
          })
        }
        setLoading(false);
      })
    }
  };

  return (

    <>
      {notifContextHolder}
      {modalContextHolder}
      <Form
        layout="vertical"
        form={form}
        autoComplete="off"
        onFinish={submit}
        initialValues={{
          title: '',
          resource_type: 'article',
          slug: '',
          category: "",
          status: 'draft',
          region: null,
          //regional_office: null,
          agency: null,
          author: null,
          is_publish: 0,
          is_press_release: 0,
          source_url: '',
          subject_headings: [],
          publish_date: null,
          tags: null
        }}
      >


        { isEditMode && (
          <div className="mb-5 rounded-md border border-slate-200 bg-slate-50 px-4 py-3">
            <div className="flex flex-col gap-3 md:flex-row md:items-center">
              <div>
                <div className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                  Current Status
                </div>
                <div className="mt-1 flex flex-wrap items-center gap-2">
                  <Tag color={statusColors[currentStatus] ?? 'default'} className="m-0 px-3 py-1 text-sm font-semibold uppercase">
                    {statusLabels[currentStatus] ?? currentStatus}
                  </Tag>
                  <span className="text-sm text-slate-500">Material ID: {id}</span>
                </div>
              </div>

              <div className="grid gap-3 text-sm md:ml-auto md:grid-cols-2">
                <div>
                  <div className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                    Submitted
                  </div>
                  <div className="font-medium text-slate-800">
                    {material?.submitted_at ? dateFormat(material.submitted_at.toString()) : 'Not submitted'}
                  </div>
                </div>

                <div>
                  <div className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                    Last Modified
                  </div>
                  <div className="font-medium text-slate-800">
                    {material?.modified_at ? dateFormat(material.modified_at.toString()) : 'No changes yet'}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {hasErrors && (
          <Alert
            className="mb-5"
            type="error"
            showIcon
            description="Please review the highlighted fields."
          />
        )}

        <div className="w-full md:w-[500px] mb-4">

        </div>


        <div className="mb-5 border-b border-slate-200 pb-2">
          <div className="text-sm font-semibold uppercase tracking-wide text-slate-600">
            Content
          </div>
        </div>

        <InputTitleWithValidation id={id} errors={errors} setErrors={setErrors}/>

        <Form.Item
          name="slug"
          label="Slug (Read Only)"
          validateStatus={errors.slug ? "error" : ""}
          help={errors.slug ? errors.slug[0] : ""}
        >
          <Input disabled placeholder="Slug" />
        </Form.Item>

        <div className="flex flex-col md:flex-row gap-4">

          <Form.Item
            name="author"
            label="Author Name"
            className="w-full"
            validateStatus={errors.author ? "error" : ""}
            help={errors.author ? errors.author[0] : ""}
          >
            <AuthorAutoComplete />
          </Form.Item>

          <Form.Item
            name="publish_date"
            label="Publish Date"
            className="w-full"
            validateStatus={errors.publish_date ? "error" : ""}
            help={errors.publish_date ? errors.publish_date[0] : ""}
          >
            <DatePicker className="w-full" placeholder="Publish Date" />
          </Form.Item>
        </div>

        {/* CKEditor */}
        <div className="w-full">

          {/* EDITOR CK WYSIWYG */}
          <div className="min-h-[300px] ">
            <Form.Item
              label="Write your content here"
              name="description"
              className="prose-lg !max-w-none"
              validateStatus={
                errors.description ? "error" : ""
              }
              help={
                errors.description
                  ? errors.description[0]
                  : ""
              }
            >
              <Ckeditor post={material || undefined} form={form} ckLicense={ckLicense} />
            </Form.Item>
          </div>

        </div>

        <div className="mb-5 mt-6 border-b border-slate-200 pb-2">
          <div className="text-sm font-semibold uppercase tracking-wide text-slate-600">
            Classification
          </div>
        </div>

        <Classifier form={form} errors={errors} />


        <div className="flex mt-4 flex-col md:gap-4 md:flex-row">

          {/* <Form.Item
            name="category"
            label="Select Category"
            className="w-full"
            validateStatus={errors.category ? "error" : ""}
            help={errors.category ? errors.category[0] : ""}
          >
            <Select
              options={categories ? categories.map(cat => ({ value: Number(cat.id), label: cat.name })) : [] }
              allowClear
              placeholder="Select Category"
            />
          </Form.Item> */}

          <SelectFilterType errors={errors} />

        </div>

        <div className="mb-5 mt-6 border-b border-slate-200 pb-2">
          <div className="text-sm font-semibold uppercase tracking-wide text-slate-600">
            Metadata
          </div>
        </div>

        <Form.Item
          name="source_url"
          label="Source URL"
          className="w-full mt-4"
          validateStatus={errors.source_url ? "error" : ""}
          help={errors.source_url ? errors.source_url[0] : ""}
        >
          <Input placeholder="Source URL" />
        </Form.Item>

        <div className="flex flex-col md:gap-4 md:flex-row">
          <Form.Item
            name="agency"
            label="Agency"
            className="w-full"
            validateStatus={errors.agency ? "error" : ""}
            help={errors.agency ? errors.agency[0] : ""}
          >
            {/* <Select options={agencies ? agencies.map(item => ({ value: item.code, label: item.code })) : [] }  allowClear/> */}
            <AgencyAutoComplete agencies={agencies} />
          </Form.Item>

          <Form.Item
            name="region"
            label="Select Region"
            className="w-full"
            validateStatus={errors.region ? "error" : ""}
            help={errors.region ? errors.region[0] : ""}
          >
            <Select options={regions ? regions.map(item => ({ value: item.name, label: item.name })) : [] }  allowClear/>
          </Form.Item>
        </div>

        <Form.Item
          name="tags"
          label="Tags"
          className="w-full"
          validateStatus={errors.tags ? "error" : ""}
          help={errors.tags ? errors.tags[0] : ""}
        >
          <Select
            loading={loading}
            mode="tags"
            style={{ width: '100%' }}
            placeholder="Tags Mode"
            options={tags.map(item => ({ value: item, label: item }))}
          />
        </Form.Item>

        <Form.Item
          name="status"
          className="w-full"
          validateStatus={
            errors.status ? "error" : ""
          }
          help={errors.status ? errors.status[0] : ""}
        >
          <Input readOnly hidden />
        </Form.Item>

        <Form.Item
          name="is_press_release"
          valuePropName="checked"
          className="w-full"
          validateStatus={errors.is_press_release ? "error" : ""}
          help={errors.is_press_release ? errors.is_press_release[0] : ""}
        >
          <Checkbox>PRESS RELEASE</Checkbox>
        </Form.Item>

        <div className="mt-8 flex flex-col gap-3 border-t border-slate-200 pt-5 md:flex-row md:items-center">
          {/* <ConfigProvider
            theme={{
              components: {
                Button: {
                  defaultBg: 'green',
                  defaultColor: 'white',
                  defaultHoverBorderColor: 'green',

                  defaultActiveColor: 'white',
                  defaultActiveBorderColor: '#1a8c12',
                  defaultActiveBg: '#1a8c12',

                  defaultHoverBg: '#379b30',
                  defaultHoverColor: 'white',
                }
              }
            }}>

            <Button
              className="ml-2"
              htmlType="submit"
              icon={<ProjectOutlined />}
              loading={loading}
            >
              Save Information
            </Button>
          </ConfigProvider> */}



          { (role === 'administrator' || role === 'publisher') && (
            <>
              <Button
                onClick={handleSubmitSaveOnly}
                icon={<ProjectOutlined />}
                loading={loading}
                type="primary"
                variant="outlined"
              >
                Save
              </Button>

              <ConfigProvider
              theme={{
                components: {
                  Button: {
                    defaultBg: 'green',
                    defaultColor: 'white',
                    defaultHoverBorderColor: 'green',

                    defaultActiveColor: 'white',
                    defaultActiveBorderColor: '#1a8c12',
                    defaultActiveBg: '#1a8c12',

                    defaultHoverBg: '#379b30',
                    defaultHoverColor: 'white',
                  }
                }
              }}>
                <Button
                  onClick={handleSubmitAndPublish}
                  icon={<ProjectOutlined />}
                  loading={loading}
                >
                  Save and Publish
                </Button>
              </ConfigProvider>
            </>

          )}

          { (role === 'encoder' || role === 'ee') && (
            <>
              <Button
                htmlType="submit"
                icon={<ProjectOutlined />}
                loading={loading}
                type="primary"
                variant="outlined"
              >
                Save as Draft
              </Button>


              <ConfigProvider
                theme={{
                  components: {
                    Button: {
                      defaultBg: 'green',
                      defaultColor: 'white',
                      defaultHoverBorderColor: 'green',

                      defaultActiveColor: 'white',
                      defaultActiveBorderColor: '#1a8c12',
                      defaultActiveBg: '#1a8c12',

                      defaultHoverBg: '#379b30',
                      defaultHoverColor: 'white',
                    }
                  }
                }}>
                <Button
                  onClick={handleSubmitAndSetSubmit}
                  icon={<ProjectOutlined />}
                  loading={loading}
                >
                  Save and Submit
                </Button>

              </ConfigProvider>
            </>
          )}

          <Button
            danger
            onClick={() => history.back()}
            className="md:ml-auto"
            icon={<ArrowLeftOutlined />}
            loading={loading}
            type="primary"
          >
            BACK
          </Button>
        </div>

        {/* flex contaner */}

      </Form>
    </>

  );
};

export default CreateEditMaterial;

/*
 * @Author: dingyun
 * @Date: 2023-04-18 20:15:06
 * @LastEditors: dingyun
 * @Email: dingyun@zhuosoft.com
 * @LastEditTime: 2023-04-18 23:39:42
 * @Description:
 */

import { InputFileItem } from '@/components'
import { useFormItemFillHint } from '@/hooks'
import { ProForm, ProFormSelect, ProFormTextArea } from '@ant-design/pro-components'
import { history, useIntl, useModel, useParams } from '@umijs/max'
import { App, Button, Drawer, Form } from 'antd'
import React, { useMemo, useState } from 'react'
import showdown from 'showdown'
import { AddBlogType } from '../data'
import { BlogAddApi, BlogUpdateApi } from '../services'

interface PostModalProps {
  titleValue: string
  blogInfo?: API.BlogInfo
  mainText?: string
  editor?: AddBlogType['editor']
  setIsAllDelete: (flag: boolean) => void
}

const PostModal: React.FC<PostModalProps> = React.memo(
  ({ titleValue, blogInfo, mainText, editor, setIsAllDelete }) => {
    const intl = useIntl()
    const { message } = App.useApp()
    const [form] = Form.useForm()
    const formItemFillHint = useFormItemFillHint()
    const [drawerOpen, setDrawerOpen] = useState(false)
    const [loading, setLoading] = useState(false)
    const { formatOptions, dataDictionaryObj } = useModel('useDataDictionary')
    const { id } = useParams<{ id: string }>()
    const sortOptions = useMemo(() => {
      return formatOptions(dataDictionaryObj['ARTICLE_SORT'])
    }, [dataDictionaryObj['ARTICLE_SORT']])

    const handleOpen = () => {
      if (!titleValue) {
        message.warning(formItemFillHint('form.itemTitle', 'textareaMsg'))
        return
      }

      if (!mainText || form.getFieldValue('summary')) {
        setDrawerOpen(true)
        return
      }

      let summaryValue = ''

      if (editor === 'MARKDOWN') {
        const converter = new showdown.Converter()
        summaryValue = converter
          .makeHtml(mainText)
          .replace(/(<[^>]+>)|(\n+)/g, '')
          .substring(0, 100)
      } else {
        summaryValue = mainText.replace(/(<[^>]+>)|(\n+)/g, '').substring(0, 100)
      }

      form.setFieldValue('summary', summaryValue)

      setDrawerOpen(true)
    }

    const handleClose = () => {
      setDrawerOpen(false)
    }

    const addBlog = async (params: AddBlogType) => {
      const res = await BlogAddApi(params)
      setIsAllDelete(false)
      history.replace(`/article/${res.id}`)
      message.success(intl.formatMessage({ id: 'pages.blog.blogAdd.success' }))
    }

    const editBlog = async (params: AddBlogType) => {
      await BlogUpdateApi(params)
      setIsAllDelete(false)
      history.replace('/account/center')
      message.success(intl.formatMessage({ id: 'pages.blog.blogEdit.success' }))
    }

    const handleFinish = async (values: API.BlogInfo) => {
      setLoading(true)

      const params: AddBlogType = {
        ...values,
        editor,
        title: titleValue,
        content: mainText,
        cover: values.cover
      }

      if (id) {
        params.id = id
      }

      try {
        if (id) {
          await editBlog(params)
        } else {
          await addBlog(params)
        }
      } catch (error) {
        setLoading(false)
        message.error(intl.formatMessage({ id: 'pages.blog.blogAdd.error' }))
      }
    }

    return (
      <>
        <Drawer width={350} title='发布文章' open={drawerOpen} onClose={handleClose}>
          <ProForm<API.BlogInfo>
            form={form}
            layout='vertical'
            loading={loading}
            disabled={loading}
            onFinish={handleFinish}
            initialValues={{ ...blogInfo }}
          >
            <ProFormSelect
              name='sort'
              options={sortOptions}
              label={intl.formatMessage({ id: 'pages.form.sort' })}
              placeholder={intl.formatMessage({ id: 'pages.form.selectMsg' })}
              rules={[{ required: true, message: formItemFillHint('form.sort', 'selectMsg') }]}
            />

            <ProFormSelect
              name='tags'
              mode='tags'
              options={[]}
              label={intl.formatMessage({ id: 'pages.form.itemTag' })}
              placeholder={intl.formatMessage({ id: 'pages.form.selectMsg' })}
              rules={[{ required: true, message: formItemFillHint('form.itemTag', 'selectMsg') }]}
              fieldProps={{
                maxTagCount: 1,
                maxTagTextLength: 16,
                tokenSeparators: [',', '\t', '\n', '\r']
              }}
            />

            <Form.Item name='cover' label={intl.formatMessage({ id: 'pages.form.cover' })}>
              <InputFileItem fileType='IMAGE' fileSize={2} />
            </Form.Item>

            <ProFormTextArea
              name='summary'
              fieldProps={{ showCount: true, maxLength: 100, rows: 5 }}
              label={intl.formatMessage({ id: 'pages.form.summary' })}
              placeholder={intl.formatMessage({ id: 'pages.form.textareaMsg' })}
              rules={[{ required: true, message: formItemFillHint('form.summary', 'textareaMsg') }]}
            />
          </ProForm>
        </Drawer>

        <Button type='primary' onClick={handleOpen}>
          {intl.formatMessage({ id: 'menu.post' })}
        </Button>
      </>
    )
  }
)

export default PostModal

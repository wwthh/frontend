import React,{ useState, useEffect } from 'react';
import './ExpertResult.css'
import useService from '../services'
import { Tag, List, Avatar, Icon, Skeleton } from 'antd';
import qs from 'qs';
import { QueryParam } from '../../../types';
import useRouter from 'use-react-router'
import {IExpert} from '../../../types';

function checkTag(tag: { t: string, w: number }){
    return tag.t.length <= 25
}


function ExpertResult(){
    const [key, setKey] = useState('');
    const { location } = useRouter();
    const { experts, loading, getExperts, expertsTotal } = useService();

    useEffect(() => {
        const param: QueryParam = qs.parse(location.search.slice(1));
        setKey(param.q);
    }, []);

    return(
        <div className='result'>
            <List
                itemLayout="vertical"
                size="large"
                pagination={{
                    onChange: page => {
                        console.log(page);
                        getExperts({
                            page: page,
                            size: 10,
                            domain: "name",
                            key: key,
                            sort: '1',
                            direction: true,
                            free: true,
                        });
                    },
                    pageSize: 10,
                    total: expertsTotal,
                }}
                dataSource={experts.map((item: IExpert) => ({
                    href: '/experts/1',
                    title: item.name,
                    avatar: 'https://avatarcdn.aminer.cn/upload/avatar/265/1157/1241/53f4d81cdabfaef64977b5bf.jpg!160',
                    description:
                        <div className='decription'>
                            <span className='paper-num'>论文数：</span>
                            <span className='num'>{item.n_pubs}</span>
                            <span className='split'></span>
                            <span className='use-num'>被引数：</span>
                            <span className='num'>{item.n_citation}</span>
                            <div><Icon type="bank" />{item.org === "" ? "Independent":item.org}</div>
                        </div>,
                    content:
                        item.tags !== null &&
                            item.tags.filter(checkTag).slice(0,item.tags.length >= 5 ? 5:item.tags.length).map((tag: { t: string, w: number }) => (
                                <Tag><a href={'/search?q=&'+tag.t+'type=paper'}>{tag.t}</a></Tag>
                            )) 
                }))}
                renderItem={(item:any) => (
                    <div className='result-item'>
                        <List.Item
                            key={item.title}
                        >
                            <Skeleton loading={loading}>
                            <List.Item.Meta
                                avatar={<Avatar size={100} src={item.avatar} />}
                                title={<a href={item.href}>{item.title}</a>}
                                description={item.description}
                            />
                            {item.content}
                            </Skeleton>
                        </List.Item>
                    </div>
                )}
            />
        </div>
    )
}

export default ExpertResult;

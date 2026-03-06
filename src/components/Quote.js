import { useState, useEffect } from 'react';
import styled from 'styled-components';

const QuoteBox = styled.div`
    text-align: center;
    padding: 10px;
    font-style: italic;
    color: #555;

    p:first-child {
        font-size: 1.5rem;
        margin-bottom: 10px;
    }

    p:last-child {
        font-size: 1rem;
        font-weight: bold;
    }
`;

export default function Quote() {
    const [quote, setQuote] = useState(null);

    useEffect(() => {
        fetch('/api/quoteapi')
            .then(res => res.json())
            .then(data => {
                console.log(data);
                setQuote({ content: data.content, author: data.author });
            });
    }, []);

    if (!quote) return null;

    return (
        <QuoteBox>
            <p>"{quote.content}"</p>
            <p>— {quote.author}</p>
        </QuoteBox>
    );
}